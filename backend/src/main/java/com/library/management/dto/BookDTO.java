package com.library.management.dto;

import com.library.management.entity.Book;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public class BookDTO {
    
    private Long id;
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Author is required")
    private String author;
    
    private String isbn;
    private String description;
    
    @NotBlank(message = "Department is required")
    private String department;
    
    private String subject;
    
    @NotNull(message = "Publish year is required")
    private Integer publishYear;
    
    private String publisher;
    private String language;
    private Integer pages;
    
    @NotNull(message = "Total copies is required")
    @Positive(message = "Total copies must be positive")
    private Integer totalCopies;
    
    private Integer availableCopies;
    private Integer issuedCopies;
    private Integer reservedCopies;
    
    private String coverUrl;
    private Double rating;
    private Integer reviewCount;
    private Book.BookStatus status;
    private String shelfLocation;
    private String rackNumber;
    private LocalDateTime addedDate;
    private LocalDateTime lastUpdated;
    
    // Additional fields for frontend
    private String availability; // 'available', 'borrowed', 'reserved'
    
    // Constructors
    public BookDTO() {}
    
    public BookDTO(Long id, String title, String author, String isbn, String department, 
                   Integer publishYear, Integer totalCopies, Integer availableCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.department = department;
        this.publishYear = publishYear;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
    }
    
    // Business methods
    public String getAvailability() {
        if (availableCopies != null && availableCopies > 0) {
            return "available";
        } else if (reservedCopies != null && reservedCopies > 0) {
            return "reserved";
        } else {
            return "borrowed";
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
    public void setTotalCopies(Integer totalCopies) { this.totalCopies = totalCopies; }
    
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
    
    public Book.BookStatus getStatus() { return status; }
    public void setStatus(Book.BookStatus status) { this.status = status; }
    
    public String getShelfLocation() { return shelfLocation; }
    public void setShelfLocation(String shelfLocation) { this.shelfLocation = shelfLocation; }
    
    public String getRackNumber() { return rackNumber; }
    public void setRackNumber(String rackNumber) { this.rackNumber = rackNumber; }
    
    public LocalDateTime getAddedDate() { return addedDate; }
    public void setAddedDate(LocalDateTime addedDate) { this.addedDate = addedDate; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    public void setAvailability(String availability) { this.availability = availability; }
}