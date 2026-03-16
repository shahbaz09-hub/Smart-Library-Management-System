package com.library.management.controller;

import com.library.management.entity.BookReservation;
import com.library.management.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "Reservations", description = "Book reservation endpoints")
@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Create book reservation")
    public ResponseEntity<BookReservation> createReservation(@RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        Long bookId = request.get("bookId");
        return ResponseEntity.ok(reservationService.createReservation(userId, bookId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get user reservations")
    public ResponseEntity<Page<BookReservation>> getUserReservations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reservationService.getUserReservations(userId, PageRequest.of(page, size)));
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Get book reservations")
    public ResponseEntity<List<BookReservation>> getBookReservations(@PathVariable Long bookId) {
        return ResponseEntity.ok(reservationService.getBookReservations(bookId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Cancel reservation")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.noContent().build();
    }
}
