package com.library.management.controller;

import com.library.management.dto.AuthRequest;
import com.library.management.dto.AuthResponse;
import com.library.management.dto.StudentRegistrationRequest;
import com.library.management.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping({"/api/auth", "/auth"})
@Tag(name = "Authentication", description = "Authentication and Authorization endpoints")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest authRequest) {
        AuthResponse response = authService.login(authRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register/student")
    @Operation(summary = "Student registration", description = "Register a new student")
    public ResponseEntity<AuthResponse> registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register/librarian")
    @Operation(summary = "Create librarian account", description = "Create a new librarian account (Admin only)")
    public ResponseEntity<AuthResponse> createLibrarian(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        
        AuthResponse response = authService.createLibrarian(name, email, password);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register/admin")
    @Operation(summary = "Create admin account", description = "Create a new admin account (Super Admin only)")
    public ResponseEntity<AuthResponse> createAdmin(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");
        
        AuthResponse response = authService.createAdmin(name, email, password);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Refresh JWT token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        AuthResponse response = authService.refreshToken(jwt);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Logout user (invalidate token)")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        authService.logout(jwt);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
    
    @GetMapping("/validate")
    @Operation(summary = "Validate token", description = "Validate JWT token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        boolean isValid = authService.validateToken(jwt);
        
        Map<String, Object> response = Map.of(
            "valid", isValid,
            "message", isValid ? "Token is valid" : "Token is invalid"
        );
        
        return ResponseEntity.ok(response);
    }
    
    // Demo endpoints for quick testing
    // Demo endpoints removed — use real users in MySQL and `/api/auth/login` instead.
}