package com.leetjourney.alert_service;

import com.leetjourney.alert_service.entity.Alert;
import com.leetjourney.alert_service.repository.AlertRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AlertRepositoryTestcontainersTest {

    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("energytracker")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysql::getJdbcUrl);
        registry.add("spring.datasource.username", mysql::getUsername);
        registry.add("spring.datasource.password", mysql::getPassword);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
    }

    @Autowired
    private AlertRepository alertRepository;

    @Test
    void testSaveAndFindAlertsByUserId() {
        Alert alert = Alert.builder()
                .userId(101L)
                .message("Energy usage exceeded threshold!")
                .threshold(1500.0)
                .actualUsage(1650.0)
                .timestamp(LocalDateTime.now())
                .build();

        alertRepository.save(alert);

        List<Alert> userAlerts = alertRepository.findByUserId(101L);
        Assertions.assertEquals(1, userAlerts.size());
        Assertions.assertEquals("Energy usage exceeded threshold!", userAlerts.get(0).getMessage());
    }
}
