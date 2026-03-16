package com.library.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "books")
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Author is required")
    @Size(max = 255, message = "Author cannot exceed 255 characters")
    @Column(nullable = false)
    private String author;
    
    @Column(unique = true, nullable = false)
    private String isbn;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    // Academic categorization
    @NotBlank(message = "Department is required")
    private String department;
    
    private String subject;
    
    @NotNull(message = "Publish year is required")
    private Integer publishYear;
    
    private String publisher;
    private String language = "English";
    private Integer pages;
    
    // Book availability
    @NotNull(message = "Total copies is required")
    @Positive(message = "Total copies must be positive")
    @Column(nullable = false)
    private Integer totalCopies;
    
    @Column(nullable = false)
    private Integer availableCopies;
    
    @Column(nullable = false)
    private Integer issuedCopies = 0;
    
    @Column(nullable = false)
    private Integer reservedCopies = 0;
    
    // Book metadata
    private String coverUrl;
    private Double rating = 0.0;
    private Integer reviewCount = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookStatus status = BookStatus.AVAILABLE;
    
    // Location in library
    private String shelfLocation;
    private String rackNumber;
    
    // Timestamps
    @Column(nullable = false, updatable = false)
    private LocalDateTime addedDate = LocalDateTime.now();
    
    private LocalDateTime lastUpdated = LocalDateTime.now();
    
    // Relationships
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<BookIssue> bookIssues;
    
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<BookRequest> bookRequests;
    
    // Constructors
    public Book() {}
    
    public Book(String title, String author, String isbn, String department, Integer publishYear, Integer totalCopies) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.department = department;
        this.publishYear = publishYear;
        this.totalCopies = totalCopies;
        this.availableCopies = totalCopies;
    }
    
    // Business methods
    public boolean isAvailable() {
        return availableCopies > 0 && status == BookStatus.AVAILABLE;
    }
    
    public void issueBook() {
        if (availableCopies > 0) {
            availableCopies--;
            issuedCopies++;
        }
    }
    
    public void returnBook() {
        if (issuedCopies > 0) {
            availableCopies++;
            issuedCopies--;
        }
    }
    
    public void reserveBook() {
        if (availableCopies > 0) {
            availableCopies--;
            reservedCopies++;
        }
    }
    
    public void cancelReservation() {
        if (reservedCopies > 0) {
            availableCopies++;
            reservedCopies--;
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public Integer getPublishYear() { return publishYear; }
    public void setPublishYear(Integer publishYear) { this.publishYear = publishYear; }
    
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    
    public Integer getPages() { return pages; }
    public void setPages(Integer pages) { this.pages = pages; }
    
    public Integer getTotalCopies() { return totalCopies; }
    public void setTotalCopies(Integer totalCopies) { 
        this.totalCopies = totalCopies;
        // Adjust available copies if needed
        if (this.availableCopies == null) {
            this.availableCopies = totalCopies;
        }
    }
    
    public Integer getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(Integer availableCopies) { this.availableCopies = availableCopies; }
    
    public Integer getIssuedCopies() { return issuedCopies; }
    public void setIssuedCopies(Integer issuedCopies) { this.issuedCopies = issuedCopies; }
    
    public Integer getReservedCopies() { return reservedCopies; }
    public void setReservedCopies(Integer reservedCopies) { this.reservedCopies = reservedCopies; }
    
    public String getCoverUrl() { return coverUrl; }
    public void setCoverUrl(String coverUrl) { this.coverUrl = coverUrl; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    
    public BookStatus getStatus() { return status; }
    public void setStatus(BookStatus status) { this.status = status; }
    
    public String getShelfLocation() { return shelfLocation; }
    public void setShelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; }
    
    public String getRackNumber() { return rackNumber; }
    public void setRackNumber(String rackNumber) { this.rackNumber = rackNumber; }
    
    public LocalDateTime getAddedDate() { return addedDate; }
    public void setAddedDate(LocalDateTime addedDate) { this.addedDate = addedDate; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    public Set<BookIssue> getBookIssues() { return bookIssues; }
    public void setBookIssues(Set<BookIssue> bookIssues) { this.bookIssues = bookIssues; }
    
    public Set<BookRequest> getBookRequests() { return bookRequests; }
    public void setBookRequests(Set<BookRequest> bookRequests) { this.bookRequests = bookRequests; }
    
    // Enums
    public enum BookStatus {
        AVAILABLE, UNAVAILABLE, MAINTENANCE, LOST, DAMAGED
    }
    
    @PreUpdate
    public void preUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}