package com.library.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "book_requests")
public class BookRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @NotNull(message = "Book is required")
    private Book book;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime requestDate = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;
    
    // Processing details
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processed_by")
    private User processedBy;
    
    private LocalDateTime processedDate;
    
    private String rejectionReason;
    
    // Request notes
    private String requestNotes;
    private String processingNotes;
    
    // Constructors
    public BookRequest() {}
    
    public BookRequest(User user, Book book, Priority priority) {
        this.user = user;
        this.book = book;
        this.priority = priority;
    }
    
    // Business methods
    public void approve(User processedBy) {
        this.status = RequestStatus.APPROVED;
        this.processedBy = processedBy;
        this.processedDate = LocalDateTime.now();
    }
    
    public void reject(User processedBy, String reason) {
        this.status = RequestStatus.REJECTED;
        this.processedBy = processedBy;
        this.processedDate = LocalDateTime.now();
        this.rejectionReason = reason;
    }
    
    public void fulfill() {
        this.status = RequestStatus.FULFILLED;
    }
    
    public boolean isPending() {
        return status == RequestStatus.PENDING;
    }
    
    public boolean isApproved() {
        return status == RequestStatus.APPROVED;
    }
    
    public boolean isRejected() {
        return status == RequestStatus.REJECTED;
    }
    
    public boolean isFulfilled() {
        return status == RequestStatus.FULFILLED;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }
    
    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }
    
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    
    public User getProcessedBy() { return processedBy; }
    public void setProcessedBy(User processedBy) { this.processedBy = processedBy; }
    
    public LocalDateTime getProcessedDate() { return processedDate; }
    public void setProcessedDate(LocalDateTime processedDate) { this.processedDate = processedDate; }
    
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public String getRequestNotes() { return requestNotes; }
    public void setRequestNotes(String requestNotes) { this.requestNotes = requestNotes; }
    
    public String getProcessingNotes() { return processingNotes; }
    public void setProcessingNotes(String processingNotes) { this.processingNotes = processingNotes; }
    
    // Enums
    public enum RequestStatus {
        PENDING, APPROVED, REJECTED, FULFILLED
    }
    
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
}