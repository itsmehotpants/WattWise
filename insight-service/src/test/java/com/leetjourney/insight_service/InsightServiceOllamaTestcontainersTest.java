package com.leetjourney.insight_service;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.ollama.OllamaContainer;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
@SpringBootTest
class InsightServiceOllamaTestcontainersTest {

    @Container
    static OllamaContainer ollama = new OllamaContainer(DockerImageName.parse("ollama/ollama:latest"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.ai.ollama.base-url", ollama::getEndpoint);
    }

    @Test
    void testOllamaContainerIsRunning() {
        Assertions.assertTrue(ollama.isRunning());
    }
}
