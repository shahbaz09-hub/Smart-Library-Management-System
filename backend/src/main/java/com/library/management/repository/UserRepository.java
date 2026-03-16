package com.library.management.repository;

import com.library.management.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Authentication queries
    Optional<User> findByEmail(String email);
    Optional<User> findByRollNumber(String rollNumber);
    boolean existsByEmail(String email);
    boolean existsByRollNumber(String rollNumber);
    
    // Role-based queries
    List<User> findByRole(User.Role role);
    Page<User> findByRole(User.Role role, Pageable pageable);
    
    // Status-based queries
    List<User> findByStatus(User.UserStatus status);
    Page<User> findByStatus(User.UserStatus status, Pageable pageable);
    
    // Department-based queries
    List<User> findByDepartment(String department);
    Page<User> findByDepartment(String department, Pageable pageable);
    
    // Search queries
    @Query("SELECT u FROM User u WHERE " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.rollNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<User> searchUsers(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Combined search with filters
    @Query("SELECT u FROM User u WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(u.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(u.rollNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status) AND " +
           "(:department IS NULL OR u.department = :department)")
    Page<User> findUsersWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("role") User.Role role,
            @Param("status") User.UserStatus status,
            @Param("department") String department,
            Pageable pageable
    );
    
    // Fine-related queries
    @Query("SELECT u FROM User u WHERE u.totalFines > 0")
    List<User> findUsersWithFines();
    
    @Query("SELECT u FROM User u WHERE u.totalFines > :amount")
    List<User> findUsersWithFinesGreaterThan(@Param("amount") Double amount);
    
    // Activity-based queries
    List<User> findByLastActiveDateBefore(LocalDateTime date);
    
    @Query("SELECT u FROM User u WHERE u.lastActiveDate IS NULL OR u.lastActiveDate < :date")
    List<User> findInactiveUsers(@Param("date") LocalDateTime date);
    
    // Statistics queries
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") User.Role role);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status")
    long countByStatus(@Param("status") User.UserStatus status);
    
    @Query("SELECT u.department, COUNT(u) FROM User u WHERE u.department IS NOT NULL GROUP BY u.department")
    List<Object[]> countUsersByDepartment();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.registrationDate >= :startDate")
    long countNewUsersAfter(@Param("startDate") LocalDateTime startDate);
    
    // Students specific queries
    @Query("SELECT u FROM User u WHERE u.role = 'USER' AND u.semester = :semester")
    List<User> findStudentsBySemester(@Param("semester") Integer semester);
    
    @Query("SELECT u FROM User u WHERE u.role = 'USER' AND u.department = :department AND u.semester = :semester")
    List<User> findStudentsByDepartmentAndSemester(
            @Param("department") String department, 
            @Param("semester") Integer semester
    );
    
    // Top users queries
    @Query("SELECT u FROM User u WHERE u.role = 'USER' ORDER BY SIZE(u.bookIssues) DESC")
    List<User> findTopBorrowers(Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE u.role = 'USER' ORDER BY u.totalFines DESC")
    List<User> findUsersWithHighestFines(Pageable pageable);
}