package com.library.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    private User user;
    
    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Message is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;
    
    @Column(nullable = false)
    private Boolean isRead = false;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime readAt;
    
    // Related entities for context
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id")
    private Book relatedBook;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_issue_id")
    private BookIssue relatedBookIssue;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fine_id")
    private Fine relatedFine;
    
    // Action URL for frontend navigation
    private String actionUrl;
    
    // Constructors
    public Notification() {}
    
    public Notification(User user, String title, String message, NotificationType type) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.type = type;
    }
    
    public Notification(User user, String title, String message, NotificationType type, Priority priority) {
        this.user = user;
        this.title = title;
        this.message = message;
        this.type = type;
        this.priority = priority;
    }
    
    // Business methods
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
    
    public boolean isUnread() {
        return !isRead;
    }
    
    public boolean isUrgent() {
        return priority == Priority.HIGH || priority == Priority.URGENT;
    }
    
    // Static factory methods for common notifications
    public static Notification createBookDueReminder(User user, BookIssue bookIssue) {
        String title = "Book Due Reminder";
        String message = String.format("Your book '%s' is due on %s. Please return it on time to avoid fines.",
                bookIssue.getBook().getTitle(), bookIssue.getDueDate());
        
        Notification notification = new Notification(user, title, message, NotificationType.DUE_REMINDER, Priority.MEDIUM);
        notification.setRelatedBook(bookIssue.getBook());
        notification.setRelatedBookIssue(bookIssue);
        notification.setActionUrl("/dashboard/borrowed-books");
        return notification;
    }
    
    public static Notification createOverdueNotification(User user, BookIssue bookIssue) {
        String title = "Book Overdue";
        String message = String.format("Your book '%s' is overdue by %d days. Please return it immediately to avoid additional fines.",
                bookIssue.getBook().getTitle(), bookIssue.getDaysOverdue());
        
        Notification notification = new Notification(user, title, message, NotificationType.OVERDUE, Priority.HIGH);
        notification.setRelatedBook(bookIssue.getBook());
        notification.setRelatedBookIssue(bookIssue);
        notification.setActionUrl("/dashboard/borrowed-books");
        return notification;
    }
    
    public static Notification createFineNotification(User user, Fine fine) {
        String title = "Fine Applied";
        String message = String.format("A fine of ₹%.2f has been applied to your account for the book '%s'.",
                fine.getAmount(), fine.getBookIssue().getBook().getTitle());
        
        Notification notification = new Notification(user, title, message, NotificationType.FINE_APPLIED, Priority.HIGH);
        notification.setRelatedBook(fine.getBookIssue().getBook());
        notification.setRelatedFine(fine);
        notification.setActionUrl("/dashboard/fines");
        return notification;
    }
    
    public static Notification createBookRequestApproved(User user, BookRequest bookRequest) {
        String title = "Book Request Approved";
        String message = String.format("Your request for the book '%s' has been approved. Please visit the library to collect it.",
                bookRequest.getBook().getTitle());
        
        Notification notification = new Notification(user, title, message, NotificationType.REQUEST_APPROVED, Priority.MEDIUM);
        notification.setRelatedBook(bookRequest.getBook());
        notification.setActionUrl("/dashboard/requests");
        return notification;
    }
    
    public static Notification createBookAvailable(User user, Book book) {
        String title = "Book Available";
        String message = String.format("The book '%s' you requested is now available for borrowing.",
                book.getTitle());
        
        Notification notification = new Notification(user, title, message, NotificationType.BOOK_AVAILABLE, Priority.MEDIUM);
        notification.setRelatedBook(book);
        notification.setActionUrl("/books/" + book.getId());
        return notification;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
    
    public Book getRelatedBook() { return relatedBook; }
    public void setRelatedBook(Book relatedBook) { this.relatedBook = relatedBook; }
    
    public BookIssue getRelatedBookIssue() { return relatedBookIssue; }
    public void setRelatedBookIssue(BookIssue relatedBookIssue) { this.relatedBookIssue = relatedBookIssue; }
    
    public Fine getRelatedFine() { return relatedFine; }
    public void setRelatedFine(Fine relatedFine) { this.relatedFine = relatedFine; }
    
    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }
    
    // Enums
    public enum NotificationType {
        DUE_REMINDER,
        OVERDUE,
        FINE_APPLIED,
        FINE_PAID,
        REQUEST_APPROVED,
        REQUEST_REJECTED,
        BOOK_AVAILABLE,
        BOOK_RETURNED,
        ACCOUNT_SUSPENDED,
        GENERAL
    }
    
    public enum Priority {
        LOW, MEDIUM, HIGH, URGENT
    }
}