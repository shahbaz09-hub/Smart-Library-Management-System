package com.library.management.controller;

import com.library.management.dto.BookDTO;
import com.library.management.entity.Book;
import com.library.management.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Books", description = "Book management endpoints")
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping
    @Operation(summary = "Get all books")
    public ResponseEntity<Page<BookDTO>> getAll(@RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookService.getAll(page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book by id")
    public ResponseEntity<BookDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getById(id));
    }

    // Public search endpoints permitted by SecurityConfig
    @GetMapping("/search")
    @Operation(summary = "Search books by keyword")
    public ResponseEntity<Page<BookDTO>> search(@RequestParam(name = "q", required = false) String q,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookService.search(q, page, size));
    }

    @GetMapping("/browse")
    @Operation(summary = "Browse books with filters")
    public ResponseEntity<Page<BookDTO>> browse(@RequestParam(required = false) String department,
                                                @RequestParam(required = false) String subject,
                                                @RequestParam(required = false) Book.BookStatus status,
                                                @RequestParam(defaultValue = "false") boolean availableOnly,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(bookService.browse(department, subject, status, availableOnly, page, size));
    }

    // Librarian/Admin endpoints (paths aligned with SecurityConfig matchers)
    @PostMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Add new book", description = "Requires Librarian/Admin role")
    public ResponseEntity<BookDTO> add(@Valid @RequestBody BookDTO dto) {
        return ResponseEntity.ok(bookService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Update book", description = "Requires Librarian/Admin role")
    public ResponseEntity<BookDTO> update(@PathVariable Long id, @Valid @RequestBody BookDTO dto) {
        return ResponseEntity.ok(bookService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Delete book", description = "Requires Admin role")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bookService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
