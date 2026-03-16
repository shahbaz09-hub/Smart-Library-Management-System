package com.library.management.controller;

import com.library.management.dto.AnalyticsDTO;
import com.library.management.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Analytics", description = "Analytics and reports endpoints")
@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Get dashboard analytics")
    public ResponseEntity<AnalyticsDTO> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }

    @GetMapping("/books/popular")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get popular books")
    public ResponseEntity<List<AnalyticsDTO.BookAnalytics>> getPopularBooks() {
        return ResponseEntity.ok(analyticsService.getPopularBooks());
    }
}
