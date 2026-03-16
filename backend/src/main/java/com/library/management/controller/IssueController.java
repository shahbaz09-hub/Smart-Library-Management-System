package com.library.management.controller;

import com.library.management.entity.BookIssue;
import com.library.management.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Book Issues", description = "Book issue/return/renew endpoints")
@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class IssueController {

    @Autowired
    private IssueService issueService;

    @PostMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Issue a book (Librarian/Admin)")
    public ResponseEntity<BookIssue> issue(@RequestParam Long userId,
                                           @RequestParam Long bookId,
                                           @RequestParam Long issuedBy) {
        return ResponseEntity.ok(issueService.issueBook(userId, bookId, issuedBy));
    }

    @PutMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Return a book (Librarian/Admin)")
    public ResponseEntity<BookIssue> returnBook(@PathVariable("id") Long issueId,
                                                @RequestParam Long returnedTo) {
        return ResponseEntity.ok(issueService.returnBook(issueId, returnedTo));
    }

    @PutMapping("/{id}/renew")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Renew a book issue (Librarian/Admin)")
    public ResponseEntity<BookIssue> renew(@PathVariable("id") Long issueId) {
        return ResponseEntity.ok(issueService.renew(issueId));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get user's issues (Authenticated)")
    public ResponseEntity<Page<BookIssue>> userIssues(@PathVariable Long userId,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(issueService.getUserIssues(userId, page, size));
    }
}
