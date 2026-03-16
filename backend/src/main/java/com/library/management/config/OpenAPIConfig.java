package com.library.management.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {
    @Bean
    public OpenAPI myOpenAPI() {
        Server server = new Server();
        server.setUrl("/api");
        server.setDescription("Local Development");

        Contact contact = new Contact();
        contact.setName("Library Management Support");
        contact.setEmail("support@library.com");

        Info info = new Info()
                .title("Library Management API")
                .version("1.0.0")
                .description("This API exposes endpoints to manage the library management system.")
                .contact(contact);

        return new OpenAPI()
                .info(info)
                .servers(List.of(server));
    }
}
