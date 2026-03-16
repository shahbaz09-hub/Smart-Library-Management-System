package com.library.management.service;

import com.library.management.dto.AuthRequest;
import com.library.management.dto.AuthResponse;
import com.library.management.dto.StudentRegistrationRequest;
import com.library.management.dto.UserDTO;
import com.library.management.entity.User;
import com.library.management.exception.AuthenticationException;
import com.library.management.repository.UserRepository;
import com.library.management.security.JwtUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public AuthResponse login(AuthRequest authRequest) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authRequest.getEmail(), 
                    authRequest.getPassword()
                )
            );
            
            // Get user details
            User user = (User) authentication.getPrincipal();
            
            // Update last active date
            user.setLastActiveDate(LocalDateTime.now());
            userRepository.save(user);
            
            // Create JWT token with additional claims
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("role", user.getRole().name());
            claims.put("name", user.getName());
            if (user.getRollNumber() != null) {
                claims.put("rollNumber", user.getRollNumber());
            }
            if (user.getDepartment() != null) {
                claims.put("department", user.getDepartment());
            }
            
            String token = jwtUtil.generateToken(user, claims);
            
            // Convert to DTO
            UserDTO userDTO = modelMapper.map(user, UserDTO.class);
            
            return new AuthResponse(token, userDTO, "Login successful");
            
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Invalid email or password");
        } catch (Exception e) {
            throw new AuthenticationException("Authentication failed: " + e.getMessage());
        }
    }
    
    public AuthResponse register(StudentRegistrationRequest registrationRequest) {
        try {
            // Register the student
            UserDTO userDTO = userService.registerStudent(registrationRequest);
            
            // Get the saved user for authentication
            User user = userRepository.findByEmail(userDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException("User registration failed"));
            
            // Create JWT token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("role", user.getRole().name());
            claims.put("name", user.getName());
            claims.put("rollNumber", user.getRollNumber());
            claims.put("department", user.getDepartment());
            
            String token = jwtUtil.generateToken(user, claims);
            
            return new AuthResponse(token, userDTO, "Registration successful");
            
        } catch (Exception e) {
            throw new AuthenticationException("Registration failed: " + e.getMessage());
        }
    }
    
    public AuthResponse createLibrarian(String name, String email, String password) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                throw new AuthenticationException("Email already exists");
            }
            
            // Create librarian user
            User librarian = new User();
            librarian.setName(name);
            librarian.setEmail(email);
            librarian.setPassword(passwordEncoder.encode(password));
            librarian.setRole(User.Role.LIBRARIAN);
            librarian.setStatus(User.UserStatus.ACTIVE);
            librarian.setRegistrationDate(LocalDateTime.now());
            
            User savedLibrarian = userRepository.save(librarian);
            
            // Create JWT token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", savedLibrarian.getId());
            claims.put("role", savedLibrarian.getRole().name());
            claims.put("name", savedLibrarian.getName());
            
            String token = jwtUtil.generateToken(savedLibrarian, claims);
            
            UserDTO userDTO = modelMapper.map(savedLibrarian, UserDTO.class);
            
            return new AuthResponse(token, userDTO, "Librarian account created successfully");
            
        } catch (Exception e) {
            throw new AuthenticationException("Failed to create librarian account: " + e.getMessage());
        }
    }
    
    public AuthResponse createAdmin(String name, String email, String password) {
        try {
            // Check if email already exists
            if (userRepository.existsByEmail(email)) {
                throw new AuthenticationException("Email already exists");
            }
            
            // Create admin user
            User admin = new User();
            admin.setName(name);
            admin.setEmail(email);
            admin.setPassword(passwordEncoder.encode(password));
            admin.setRole(User.Role.ADMIN);
            admin.setStatus(User.UserStatus.ACTIVE);
            admin.setRegistrationDate(LocalDateTime.now());
            
            User savedAdmin = userRepository.save(admin);
            
            // Create JWT token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", savedAdmin.getId());
            claims.put("role", savedAdmin.getRole().name());
            claims.put("name", savedAdmin.getName());
            
            String token = jwtUtil.generateToken(savedAdmin, claims);
            
            UserDTO userDTO = modelMapper.map(savedAdmin, UserDTO.class);
            
            return new AuthResponse(token, userDTO, "Admin account created successfully");
            
        } catch (Exception e) {
            throw new AuthenticationException("Failed to create admin account: " + e.getMessage());
        }
    }
    
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
    
    public UserDTO getCurrentUser(String token) {
        String email = jwtUtil.extractUsername(token);
        return userService.getUserByEmail(email);
    }
    
    public AuthResponse refreshToken(String token) {
        try {
            if (!jwtUtil.validateToken(token)) {
                throw new AuthenticationException("Invalid token");
            }
            
            String email = jwtUtil.extractUsername(token);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new AuthenticationException("User not found"));
            
            // Create new token
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("role", user.getRole().name());
            claims.put("name", user.getName());
            if (user.getRollNumber() != null) {
                claims.put("rollNumber", user.getRollNumber());
            }
            if (user.getDepartment() != null) {
                claims.put("department", user.getDepartment());
            }
            
            String newToken = jwtUtil.generateToken(user, claims);
            UserDTO userDTO = modelMapper.map(user, UserDTO.class);
            
            return new AuthResponse(newToken, userDTO, "Token refreshed successfully");
            
        } catch (Exception e) {
            throw new AuthenticationException("Token refresh failed: " + e.getMessage());
        }
    }
    
    public void logout(String token) {
        // In a production environment, you might want to blacklist the token
        // For now, we'll just validate it exists
        if (!jwtUtil.validateToken(token)) {
            throw new AuthenticationException("Invalid token");
        }
        
        // Token will naturally expire, no server-side action needed for stateless JWT
    }
    
    // Demo login methods for quick testing
    public AuthResponse demoUserLogin() {
        AuthRequest demoRequest = new AuthRequest("user@demo.com", "demo123");
        return login(demoRequest);
    }
    
    public AuthResponse demoAdminLogin() {
        AuthRequest demoRequest = new AuthRequest("admin@demo.com", "demo123");
        return login(demoRequest);
    }
    
    public AuthResponse demoLibrarianLogin() {
        AuthRequest demoRequest = new AuthRequest("librarian@demo.com", "demo123");
        return login(demoRequest);
    }
}