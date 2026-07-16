package com.leetjourney.ingestion_service;

import com.leetjourney.ingestion_service.dto.EnergyUsageDto;
import com.leetjourney.ingestion_service.service.IngestionService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
@SpringBootTest
class IngestionServiceKafkaTestcontainersTest {

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.0"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
    }

    @Autowired
    private IngestionService ingestionService;

    @Test
    void testPublishEnergyUsageEvent() {
        EnergyUsageDto dto = new EnergyUsageDto(101L, 2.5);
        Assertions.assertDoesNotThrow(() -> ingestionService.publishEnergyUsageEvent(dto));
    }
}
