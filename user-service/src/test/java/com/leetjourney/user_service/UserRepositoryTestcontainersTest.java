package com.leetjourney.user_service;

import com.leetjourney.user_service.entity.User;
import com.leetjourney.user_service.repository.UserRepository;
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

import java.util.Optional;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTestcontainersTest {

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
        registry.add("spring.flyway.enabled", () -> "false");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "create-drop");
    }

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveAndFindUserByEmail() {
        User user = User.builder()
                .name("Alice")
                .surname("Smith")
                .email("alice.test@example.com")
                .address("100 Container St")
                .alerting(true)
                .energyAlertingThreshold(1500.0)
                .build();

        User savedUser = userRepository.save(user);
        Assertions.assertNotNull(savedUser.getId());

        Optional<User> found = userRepository.findByEmail("alice.test@example.com");
        Assertions.assertTrue(found.isPresent());
        Assertions.assertEquals("Alice", found.get().getName());
        Assertions.assertEquals("Smith", found.get().getSurname());
    }
}
