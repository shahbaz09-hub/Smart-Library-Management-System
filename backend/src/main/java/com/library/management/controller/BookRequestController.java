package com.library.management.controller;

import com.library.management.entity.BookRequest;
import com.library.management.service.BookRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Book Requests", description = "Book request management endpoints")
@RestController
@RequestMapping("/api/book-requests")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class BookRequestController {

    @Autowired
    private BookRequestService bookRequestService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Create book request")
    public ResponseEntity<Map<String, Object>> createRequest(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        Long bookId = Long.valueOf(request.get("bookId").toString());
        String notes = request.getOrDefault("notes", "").toString();

        BookRequest bookRequest = bookRequestService.createRequest(userId, bookId, notes);

        // Return simple response to avoid JSON serialization issues
        Map<String, Object> response = Map.of(
                "id", bookRequest.getId(),
                "userId", bookRequest.getUser().getId(),
                "bookId", bookRequest.getBook().getId(),
                "status", bookRequest.getStatus().toString(),
                "message", "Book request created successfully");

        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Get all book requests")
    public ResponseEntity<Page<BookRequest>> getAllRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookRequestService.getAllRequests(page, size));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Get pending book requests")
    public ResponseEntity<List<BookRequest>> getPendingRequests() {
        return ResponseEntity.ok(bookRequestService.getPendingRequests());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get user's book requests")
    public ResponseEntity<Page<BookRequest>> getUserRequests(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookRequestService.getUserRequests(userId, page, size));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Approve book request")
    public ResponseEntity<BookRequest> approveRequest(
            @PathVariable Long id,
            @RequestParam Long processedBy) {
        return ResponseEntity.ok(bookRequestService.approveRequest(id, processedBy));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Reject book request")
    public ResponseEntity<BookRequest> rejectRequest(
            @PathVariable Long id,
            @RequestParam Long processedBy,
            @RequestParam(required = false) String reason) {
        return ResponseEntity.ok(bookRequestService.rejectRequest(id, processedBy, reason));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get book request by ID")
    public ResponseEntity<BookRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(bookRequestService.getRequestById(id));
    }
}
