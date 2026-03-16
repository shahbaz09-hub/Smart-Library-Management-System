package com.library.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class SmartLibraryManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartLibraryManagementApplication.class, args);
        System.out.println("🚀 Smart Library Management System Started Successfully!");
        System.out.println("📚 Access API Documentation: http://localhost:8080/swagger-ui.html");
        System.out.println("🔗 Using MySQL Database: library_management");
    }
}