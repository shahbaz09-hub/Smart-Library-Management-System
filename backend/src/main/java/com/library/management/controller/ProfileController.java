package com.library.management.controller;

import com.library.management.dto.UserDTO;
import com.library.management.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Profile", description = "User profile management endpoints")
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProfileController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get current user profile")
    public ResponseEntity<UserDTO> getCurrentProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserDTO> updateProfile(Authentication authentication, @RequestBody UserDTO userDTO) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateProfileByEmail(email, userDTO));
    }

    @PutMapping("/password")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Change password")
    public ResponseEntity<Map<String, String>> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> request) {
        String email = authentication.getName();
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        userService.changePassword(email, oldPassword, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }
}
