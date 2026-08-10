package io.github.nayetdet.gamekube.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@OpenAPIDefinition(
    info = @Info(
        title = "Gamekube: API",
        version = "v1"
    )
)
@Configuration
public class OpenApiConfig {
}
