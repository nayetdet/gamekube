package io.github.nayetdet.gamekube.game;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.KubernetesClientBuilder;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;

class GameManifestPersistenceTest {

  private static final Map<String, String> SAVE_PATHS =
      Map.of(
          "bugdom", "/config/.config",
          "cavestory", "/config/.local/share/cavestory-nx",
          "doom", "/config/.config/gzdoom",
          "hyperdbz", "/config/.wine",
          "off", "/config/.local/share",
          "sonic-triple-trouble", "/config",
          "yume-nikki", "/config/.local/share");

  @Test
  void saveGamesDeclareMinioRestoreAndSync() {
    try (KubernetesClient kubernetesClient = new KubernetesClientBuilder().build()) {
      List<Game> games = new GameProvider(kubernetesClient).findAll();

      assertEquals(8, games.size());
      assertEquals(7, SAVE_PATHS.size());

      for (Game game : games) {
        Map<String, Object> podSpec = podSpec(game);
        if (Boolean.TRUE.equals(game.getHasSave())) {
          assertTrue(SAVE_PATHS.containsKey(game.getId()));
          assertTrue(hasContainer(list(podSpec.get("initContainers")), "restore-game-data"));
          assertTrue(hasContainer(list(podSpec.get("containers")), "persist-game-data"));
          assertEquals(SAVE_PATHS.get(game.getId()), gameSaveMountPath(game, podSpec));
          assertTrue(hasVolume(list(podSpec.get("volumes")), "game-data"));
        } else {
          assertEquals("loprincess", game.getId());
          assertFalse(hasContainer(list(podSpec.get("initContainers")), "restore-game-data"));
          assertFalse(hasContainer(list(podSpec.get("containers")), "persist-game-data"));
          assertFalse(hasVolume(list(podSpec.get("volumes")), "game-data"));
        }
      }
    }
  }

  private Map<String, Object> podSpec(Game game) {
    Map<String, Object> deployment =
        game.getResources().stream()
            .filter(resource -> "Deployment".equals(resource.get("kind")))
            .findFirst()
            .orElseThrow();
    return map(map(map(deployment.get("spec")).get("template")).get("spec"));
  }

  private String gameSaveMountPath(Game game, Map<String, Object> podSpec) {
    return list(podSpec.get("containers")).stream()
        .filter(container -> "${GAME_ID}".equals(container.get("name")))
        .flatMap(container -> list(container.get("volumeMounts")).stream())
        .filter(mount -> "game-data".equals(mount.get("name")))
        .map(mount -> (String) mount.get("mountPath"))
        .findFirst()
        .orElseThrow(() -> new AssertionError("Missing save mount for " + game.getId()));
  }

  private boolean hasContainer(List<Map<String, Object>> containers, String name) {
    return containers.stream().anyMatch(container -> name.equals(container.get("name")));
  }

  private boolean hasVolume(List<Map<String, Object>> volumes, String name) {
    return volumes.stream().anyMatch(volume -> name.equals(volume.get("name")));
  }

  @SuppressWarnings("unchecked")
  private Map<String, Object> map(Object value) {
    assertNotNull(value);
    return (Map<String, Object>) value;
  }

  @SuppressWarnings("unchecked")
  private List<Map<String, Object>> list(Object value) {
    if (value == null) {
      return List.of();
    }
    return (List<Map<String, Object>>) value;
  }
}
