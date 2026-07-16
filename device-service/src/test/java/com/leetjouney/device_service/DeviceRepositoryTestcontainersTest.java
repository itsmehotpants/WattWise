package com.leetjouney.device_service;

import com.leetjouney.device_service.entity.Device;
import com.leetjouney.device_service.model.DeviceType;
import com.leetjouney.device_service.repository.DeviceRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class DeviceRepositoryTestcontainersTest {

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
    private DeviceRepository deviceRepository;

    @Test
    void testSaveAndFindDevicesByUserId() {
        Device device1 = Device.builder()
                .name("Smart Thermostat")
                .type(DeviceType.HVAC)
                .location("Living Room")
                .userId(101L)
                .build();

        Device device2 = Device.builder()
                .name("EV Charger")
                .type(DeviceType.APPLIANCE)
                .location("Garage")
                .userId(101L)
                .build();

        deviceRepository.save(device1);
        deviceRepository.save(device2);

        List<Device> userDevices = deviceRepository.findByUserId(101L);
        Assertions.assertEquals(2, userDevices.size());
    }
}
