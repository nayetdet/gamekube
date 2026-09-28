package io.github.nayetdet.gamekube.config;

import io.github.springwolf.core.configuration.properties.SpringwolfConfigProperties;
import io.github.springwolf.core.configuration.properties.SpringwolfConfigProperties.ConfigDocket;
import io.github.springwolf.core.configuration.properties.SpringwolfConfigProperties.ConfigDocket.Info;
import io.github.springwolf.plugins.stomp.configuration.properties.SpringwolfStompConfigProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class AsyncApiConfig implements WebMvcConfigurer {

  private final SpringwolfConfigProperties springwolfProperties;
  private final SpringwolfStompConfigProperties stompProperties;

  @PostConstruct
  void configure() {
    ConfigDocket docket = springwolfProperties.getDocket();
    Info info = docket.getInfo();
    info.setTitle("GameKube WebSocket API");
    info.setVersion("v1");
    info.setDescription("STOMP over WebSocket API for real-time GameKube events.");
    stompProperties.getEndpoint().setApp("/app");
    stompProperties.getEndpoint().setUser("/user");
  }

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry
        .addResourceHandler("/springwolf/**")
        .addResourceLocations("classpath:/META-INF/resources/springwolf/");
  }
}
