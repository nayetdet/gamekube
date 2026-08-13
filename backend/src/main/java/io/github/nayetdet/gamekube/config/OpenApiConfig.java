package io.github.nayetdet.gamekube.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(info = @Info(title = "Gamekube: API", version = "v1"))
@Configuration
public class OpenApiConfig {}
