package io.github.nayetdet.gamekube.scheduler;

import io.github.nayetdet.gamekube.game.GameInstanceLifecycleProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GameInstanceLifecycleScheduler {

  private final GameInstanceLifecycleProvider gameInstanceLifecycleProvider;

  @Scheduled(fixedDelayString = "${gamekube.game.instance.cleanup.interval}")
  public void cleanup() {
    gameInstanceLifecycleProvider.cleanup();
  }
}
