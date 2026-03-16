package com.library.management.controller;

import com.library.management.entity.Fine;
import com.library.management.service.FineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Fines", description = "Fine management endpoints")
@RestController
@RequestMapping("/api/fines")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class FineController {

    @Autowired
    private FineService fineService;

    @GetMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Get all fines (Librarian/Admin)")
    public ResponseEntity<Page<Fine>> getAll(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(fineService.getAll(page, size));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get user's fines (Authenticated)")
    public ResponseEntity<Page<Fine>> getByUser(@PathVariable Long userId,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(fineService.getByUser(userId, page, size));
    }

    @PostMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Pay fine")
    public ResponseEntity<Fine> pay(@PathVariable("id") Long fineId) {
        return ResponseEntity.ok(fineService.pay(fineId));
    }

    @PutMapping("/{id}/waive")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Waive fine (Admin)")
    public ResponseEntity<Fine> waive(@PathVariable("id") Long fineId) {
        return ResponseEntity.ok(fineService.waive(fineId));
    }
}
