package com.library.management.config;

import com.library.management.entity.User;
import com.library.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUserIfMissing("admin@demo.com", "Demo Admin", "demo123", User.Role.ADMIN);
        seedUserIfMissing("user@demo.com", "Demo Student", "demo123", User.Role.USER);
    }

    private void seedUserIfMissing(String email, String name, String rawPassword, User.Role role) {
        if (!userRepository.existsByEmail(email)) {
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            user.setStatus(User.UserStatus.ACTIVE);
            user.setRegistrationDate(LocalDateTime.now());
            user.setTotalFines(0.0);
            userRepository.save(user);
            System.out.println("Created demo user: " + email + " (role=" + role + ")");
        }
    }
}