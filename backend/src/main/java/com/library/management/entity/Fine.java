package com.library.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fines")
public class Fine {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_issue_id", nullable = false)
    @NotNull(message = "Book issue is required")
    private BookIssue bookIssue;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @Column(nullable = false)
    private Double amount;
    
    @Column(nullable = false)
    private Integer daysPastDue;
    
    @Column(nullable = false)
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FineStatus status = FineStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FineType type = FineType.OVERDUE;
    
    // Payment details
    private LocalDate paidDate;
    private String paymentMethod;
    private String transactionId;
    
    // Discount/Waiver details
    private Double discountApplied = 0.0;
    private LocalDate waivedDate;
    private String waivedReason;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waived_by")
    private User waivedBy;
    
    // Timestamps
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdDate = LocalDateTime.now();
    
    private LocalDateTime lastReminderSent;
    
    // Notes
    private String notes;
    
    // Constructors
    public Fine() {}
    
    public Fine(User user, BookIssue bookIssue, Double amount, Integer daysPastDue, LocalDate dueDate) {
        this.user = user;
        this.bookIssue = bookIssue;
        this.amount = amount;
        this.daysPastDue = daysPastDue;
        this.dueDate = dueDate;
    }
    
    // Business methods
    public Double getEffectiveAmount() {
        return amount - discountApplied;
    }
    
    public boolean isPaid() {
        return status == FineStatus.PAID;
    }
    
    public boolean isWaived() {
        return status == FineStatus.WAIVED;
    }
    
    public boolean isOverdue() {
        return status == FineStatus.OVERDUE;
    }
    
    public void markAsPaid(String paymentMethod, String transactionId) {
        this.status = FineStatus.PAID;
        this.paidDate = LocalDate.now();
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
    }
    
    public void waiveFine(User waivedBy, String reason) {
        this.status = FineStatus.WAIVED;
        this.waivedDate = LocalDate.now();
        this.waivedBy = waivedBy;
        this.waivedReason = reason;
    }
    
    public void applyDiscount(Double discount) {
        if (discount > 0 && discount <= amount) {
            this.discountApplied = discount;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public BookIssue getBookIssue() { return bookIssue; }
    public void setBookIssue(BookIssue bookIssue) { this.bookIssue = bookIssue; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public Integer getDaysPastDue() { return daysPastDue; }
    public void setDaysPastDue(Integer daysPastDue) { this.daysPastDue = daysPastDue; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public FineStatus getStatus() { return status; }
    public void setStatus(FineStatus status) { this.status = status; }
    
    public FineType getType() { return type; }
    public void setType(FineType type) { this.type = type; }
    
    public LocalDate getPaidDate() { return paidDate; }
    public void setPaidDate(LocalDate paidDate) { this.paidDate = paidDate; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public Double getDiscountApplied() { return discountApplied; }
    public void setDiscountApplied(Double discountApplied) { this.discountApplied = discountApplied; }
    
    public LocalDate getWaivedDate() { return waivedDate; }
    public void setWaivedDate(LocalDate waivedDate) { this.waivedDate = waivedDate; }
    
    public String getWaivedReason() { return waivedReason; }
    public void setWaivedReason(String waivedReason) { this.waivedReason = waivedReason; }
    
    public User getWaivedBy() { return waivedBy; }
    public void setWaivedBy(User waivedBy) { this.waivedBy = waivedBy; }
    
    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
    
    public LocalDateTime getLastReminderSent() { return lastReminderSent; }
    public void setLastReminderSent(LocalDateTime lastReminderSent) { this.lastReminderSent = lastReminderSent; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    // Enums
    public enum FineStatus {
        PENDING, PAID, WAIVED, OVERDUE
    }
    
    public enum FineType {
        OVERDUE, DAMAGE, LOST_BOOK, LATE_RETURN
    }
}