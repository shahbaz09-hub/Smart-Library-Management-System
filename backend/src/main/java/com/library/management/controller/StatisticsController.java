package com.library.management.controller;

import com.library.management.dto.DashboardStatsDTO;
import com.library.management.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Statistics", description = "Dashboard statistics endpoints")
@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get admin dashboard statistics")
    public ResponseEntity<DashboardStatsDTO> getAdminStats() {
        return ResponseEntity.ok(statisticsService.getAdminStats());
    }

    @GetMapping("/librarian")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Get librarian dashboard statistics")
    public ResponseEntity<DashboardStatsDTO> getLibrarianStats() {
        return ResponseEntity.ok(statisticsService.getLibrarianStats());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get user dashboard statistics")
    public ResponseEntity<DashboardStatsDTO> getUserStats(@PathVariable Long userId) {
        return ResponseEntity.ok(statisticsService.getUserStats(userId));
    }
}
