package com.library.management.controller;

import com.library.management.dto.UserDTO;
import com.library.management.entity.User;
import com.library.management.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Users", description = "User management endpoints")
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all users (Admin)")
    public ResponseEntity<Page<UserDTO>> getAll(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search users with keyword (Admin)")
    public ResponseEntity<Page<UserDTO>> search(@RequestParam(name = "q") String q,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userService.searchUsers(q, pageable));
    }

    @GetMapping("/filter")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Filter users (Admin)")
    public ResponseEntity<Page<UserDTO>> filter(@RequestParam(required = false) String q,
                                                @RequestParam(required = false) User.Role role,
                                                @RequestParam(required = false) User.UserStatus status,
                                                @RequestParam(required = false) String department,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userService.getUsersWithFilters(q, role, status, department, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN','USER')")
    @Operation(summary = "Get user by id (Authenticated)")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN','USER')")
    @Operation(summary = "Update user profile (Authenticated)")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody UserDTO body) {
        return ResponseEntity.ok(userService.updateUser(id, body));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user (Admin)")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // Additional admin utilities
    @PostMapping("/{id}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Suspend user (Admin)")
    public ResponseEntity<UserDTO> suspend(@PathVariable Long id, @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(userService.suspendUser(id, reason));
    }

    @PostMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate user (Admin)")
    public ResponseEntity<UserDTO> activate(@PathVariable Long id) {
        return ResponseEntity.ok(userService.activateUser(id));
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List users by role (Admin)")
    public ResponseEntity<List<UserDTO>> byRole(@PathVariable User.Role role) {
        return ResponseEntity.ok(userService.getUsersByRole(role));
    }

    @GetMapping("/department/{dept}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List users by department (Admin)")
    public ResponseEntity<List<UserDTO>> byDepartment(@PathVariable("dept") String department) {
        return ResponseEntity.ok(userService.getUsersByDepartment(department));
    }
}
