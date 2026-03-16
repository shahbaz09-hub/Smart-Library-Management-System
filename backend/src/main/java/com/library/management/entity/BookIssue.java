package com.library.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "book_issues")
public class BookIssue {
    
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
    
    @Column(nullable = false)
    private LocalDate issueDate;
    
    @Column(nullable = false)
    private LocalDate dueDate;
    
    private LocalDate returnDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueStatus status = IssueStatus.ISSUED;
    
    // Fine calculation
    @Column(nullable = false)
    private Double fineAmount = 0.0;
    
    // Renewal tracking
    @Column(nullable = false)
    private Integer renewCount = 0;
    
    @Column(nullable = false)
    private Integer maxRenewals = 2;
    
    // Issued by (librarian/admin)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issued_by")
    private User issuedBy;
    
    // Returned to (librarian/admin)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "returned_to")
    private User returnedTo;
    
    // Timestamps
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    // Notes
    private String issueNotes;
    private String returnNotes;
    
    // Constructors
    public BookIssue() {}
    
    public BookIssue(User user, Book book, LocalDate issueDate, LocalDate dueDate, User issuedBy) {
        this.user = user;
        this.book = book;
        this.issueDate = issueDate;
        this.dueDate = dueDate;
        this.issuedBy = issuedBy;
    }
    
    // Business methods
    public boolean isOverdue() {
        return returnDate == null && LocalDate.now().isAfter(dueDate);
    }
    
    public boolean isDueSoon() {
        if (returnDate != null) return false;
        return LocalDate.now().plusDays(3).isAfter(dueDate) || LocalDate.now().plusDays(3).isEqual(dueDate);
    }
    
    public long getDaysOverdue() {
        if (!isOverdue()) return 0;
        return LocalDate.now().toEpochDay() - dueDate.toEpochDay();
    }
    
    public boolean canRenew() {
        return renewCount < maxRenewals && status == IssueStatus.ISSUED && !isOverdue();
    }
    
    public void renewBook(int renewalDays) {
        if (canRenew()) {
            this.dueDate = this.dueDate.plusDays(renewalDays);
            this.renewCount++;
            this.updatedAt = LocalDateTime.now();
        }
    }
    
    public void returnBook(User returnedTo) {
        this.returnDate = LocalDate.now();
        this.status = IssueStatus.RETURNED;
        this.returnedTo = returnedTo;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }
    
    public LocalDate getIssueDate() { return issueDate; }
    public void setIssueDate(LocalDate issueDate) { this.issueDate = issueDate; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }
    
    public IssueStatus getStatus() { return status; }
    public void setStatus(IssueStatus status) { this.status = status; }
    
    public Double getFineAmount() { return fineAmount; }
    public void setFineAmount(Double fineAmount) { this.fineAmount = fineAmount; }
    
    public Integer getRenewCount() { return renewCount; }
    public void setRenewCount(Integer renewCount) { this.renewCount = renewCount; }
    
    public Integer getMaxRenewals() { return maxRenewals; }
    public void setMaxRenewals(Integer maxRenewals) { this.maxRenewals = maxRenewals; }
    
    public User getIssuedBy() { return issuedBy; }
    public void setIssuedBy(User issuedBy) { this.issuedBy = issuedBy; }
    
    public User getReturnedTo() { return returnedTo; }
    public void setReturnedTo(User returnedTo) { this.returnedTo = returnedTo; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public String getIssueNotes() { return issueNotes; }
    public void setIssueNotes(String issueNotes) { this.issueNotes = issueNotes; }
    
    public String getReturnNotes() { return returnNotes; }
    public void setReturnNotes(String returnNotes) { this.returnNotes = returnNotes; }
    
    // Enums
    public enum IssueStatus {
        ISSUED, RETURNED, OVERDUE, LOST, RENEWED
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}