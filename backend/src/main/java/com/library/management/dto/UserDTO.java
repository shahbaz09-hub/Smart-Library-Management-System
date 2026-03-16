package com.library.management.dto;

import com.library.management.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class UserDTO {
    
    private Long id;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;
    
    private String rollNumber;
    private String department;
    private Integer semester;
    private User.Role role;
    private User.UserStatus status;
    private Double totalFines;
    private String phoneNumber;
    private String address;
    private LocalDateTime registrationDate;
    private LocalDateTime lastActiveDate;
    
    // Statistics
    private Integer totalBooksIssued;
    private Integer currentlyIssuedBooks;
    private Integer overdueBooks;
    private Integer totalFinesCount;
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(Long id, String name, String email, String rollNumber, String department, 
                   Integer semester, User.Role role, User.UserStatus status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.rollNumber = rollNumber;
        this.department = department;
        this.semester = semester;
        this.role = role;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    
    public User.Role getRole() { return role; }
    public void setRole(User.Role role) { this.role = role; }
    
    public User.UserStatus getStatus() { return status; }
    public void setStatus(User.UserStatus status) { this.status = status; }
    
    public Double getTotalFines() { return totalFines; }
    public void setTotalFines(Double totalFines) { this.totalFines = totalFines; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
    
    public LocalDateTime getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(LocalDateTime lastActiveDate) { this.lastActiveDate = lastActiveDate; }
    
    public Integer getTotalBooksIssued() { return totalBooksIssued; }
    public void setTotalBooksIssued(Integer totalBooksIssued) { this.totalBooksIssued = totalBooksIssued; }
    
    public Integer getCurrentlyIssuedBooks() { return currentlyIssuedBooks; }
    public void setCurrentlyIssuedBooks(Integer currentlyIssuedBooks) { this.currentlyIssuedBooks = currentlyIssuedBooks; }
    
    public Integer getOverdueBooks() { return overdueBooks; }
    public void setOverdueBooks(Integer overdueBooks) { this.overdueBooks = overdueBooks; }
    
    public Integer getTotalFinesCount() { return totalFinesCount; }
    public void setTotalFinesCount(Integer totalFinesCount) { this.totalFinesCount = totalFinesCount; }
}