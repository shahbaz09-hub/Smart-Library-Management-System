package com.library.management.repository;

import com.library.management.entity.BookIssue;
import com.library.management.entity.User;
import com.library.management.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {
    
    // User-based queries
    List<BookIssue> findByUser(User user);
    Page<BookIssue> findByUser(User user, Pageable pageable);
    
    List<BookIssue> findByUserAndStatus(User user, BookIssue.IssueStatus status);
    Page<BookIssue> findByUserAndStatus(User user, BookIssue.IssueStatus status, Pageable pageable);
    
    // Book-based queries
    List<BookIssue> findByBook(Book book);
    Page<BookIssue> findByBook(Book book, Pageable pageable);
    
    List<BookIssue> findByBookAndStatus(Book book, BookIssue.IssueStatus status);
    
    // Status-based queries
    List<BookIssue> findByStatus(BookIssue.IssueStatus status);
    Page<BookIssue> findByStatus(BookIssue.IssueStatus status, Pageable pageable);
    
    // Active issues (not returned)
    @Query("SELECT bi FROM BookIssue bi WHERE bi.status IN ('ISSUED', 'OVERDUE', 'RENEWED')")
    List<BookIssue> findActiveIssues();
    
    @Query("SELECT bi FROM BookIssue bi WHERE bi.status IN ('ISSUED', 'OVERDUE', 'RENEWED')")
    Page<BookIssue> findActiveIssues(Pageable pageable);
    
    // User's active issues
    @Query("SELECT bi FROM BookIssue bi WHERE bi.user = :user AND bi.status IN ('ISSUED', 'OVERDUE', 'RENEWED')")
    List<BookIssue> findActiveIssuesByUser(@Param("user") User user);
    
    // Overdue issues
    @Query("SELECT bi FROM BookIssue bi WHERE bi.dueDate < :currentDate AND bi.status IN ('ISSUED', 'RENEWED')")
    List<BookIssue> findOverdueIssues(@Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT bi FROM BookIssue bi WHERE bi.dueDate < :currentDate AND bi.status IN ('ISSUED', 'RENEWED')")
    Page<BookIssue> findOverdueIssues(@Param("currentDate") LocalDate currentDate, Pageable pageable);
    
    // Due soon issues
    @Query("SELECT bi FROM BookIssue bi WHERE bi.dueDate BETWEEN :currentDate AND :dueSoonDate AND bi.status IN ('ISSUED', 'RENEWED')")
    List<BookIssue> findDueSoonIssues(@Param("currentDate") LocalDate currentDate, @Param("dueSoonDate") LocalDate dueSoonDate);
    
    // Issues by date range
    List<BookIssue> findByIssueDateBetween(LocalDate startDate, LocalDate endDate);
    List<BookIssue> findByReturnDateBetween(LocalDate startDate, LocalDate endDate);
    List<BookIssue> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Issues by librarian
    List<BookIssue> findByIssuedBy(User issuedBy);
    List<BookIssue> findByReturnedTo(User returnedTo);
    
    // Search queries
    @Query("SELECT bi FROM BookIssue bi WHERE " +
           "LOWER(bi.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(bi.user.rollNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(bi.book.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(bi.book.isbn) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<BookIssue> searchIssues(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Advanced search with filters
    @Query("SELECT bi FROM BookIssue bi WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(bi.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(bi.user.rollNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(bi.book.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:status IS NULL OR bi.status = :status) AND " +
           "(:department IS NULL OR bi.user.department = :department) AND " +
           "(:startDate IS NULL OR bi.issueDate >= :startDate) AND " +
           "(:endDate IS NULL OR bi.issueDate <= :endDate)")
    Page<BookIssue> findIssuesWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("status") BookIssue.IssueStatus status,
            @Param("department") String department,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
    
    // Statistics queries
    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.status = :status")
    long countByStatus(@Param("status") BookIssue.IssueStatus status);
    
    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.issueDate = :date")
    long countByIssueDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.returnDate = :date")
    long countByReturnDate(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.issueDate BETWEEN :startDate AND :endDate")
    long countIssuesBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(bi) FROM BookIssue bi WHERE bi.returnDate BETWEEN :startDate AND :endDate")
    long countReturnsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Department-wise statistics
    @Query("SELECT bi.user.department, COUNT(bi) FROM BookIssue bi WHERE bi.user.department IS NOT NULL GROUP BY bi.user.department")
    List<Object[]> countIssuesByDepartment();
    
    // Monthly statistics
    @Query("SELECT YEAR(bi.issueDate), MONTH(bi.issueDate), COUNT(bi) FROM BookIssue bi GROUP BY YEAR(bi.issueDate), MONTH(bi.issueDate) ORDER BY YEAR(bi.issueDate), MONTH(bi.issueDate)")
    List<Object[]> getMonthlyIssueStatistics();
    
    // Top borrowed books
    @Query("SELECT bi.book, COUNT(bi) as issueCount FROM BookIssue bi GROUP BY bi.book ORDER BY issueCount DESC")
    List<Object[]> findMostBorrowedBooks(Pageable pageable);
    
    // User borrowing history
    @Query("SELECT bi FROM BookIssue bi WHERE bi.user = :user ORDER BY bi.issueDate DESC")
    List<BookIssue> findUserBorrowingHistory(@Param("user") User user, Pageable pageable);
    
    // Check if user has already borrowed a specific book
    @Query("SELECT bi FROM BookIssue bi WHERE bi.user = :user AND bi.book = :book AND bi.status IN ('ISSUED', 'OVERDUE', 'RENEWED')")
    Optional<BookIssue> findActiveIssueByUserAndBook(@Param("user") User user, @Param("book") Book book);
    
    // Renewal queries
    @Query("SELECT bi FROM BookIssue bi WHERE bi.renewCount > 0")
    List<BookIssue> findRenewedIssues();
    
    @Query("SELECT bi FROM BookIssue bi WHERE bi.renewCount >= bi.maxRenewals AND bi.status IN ('ISSUED', 'OVERDUE', 'RENEWED')")
    List<BookIssue> findIssuesAtMaxRenewals();
    
    // Fine-related queries
    @Query("SELECT bi FROM BookIssue bi WHERE bi.fineAmount > 0")
    List<BookIssue> findIssuesWithFines();
    
    @Query("SELECT SUM(bi.fineAmount) FROM BookIssue bi WHERE bi.fineAmount > 0")
    Double getTotalFineAmount();
    
    // Issues that need attention
    @Query("SELECT bi FROM BookIssue bi WHERE bi.dueDate < :currentDate AND bi.status IN ('ISSUED', 'RENEWED') AND bi.fineAmount = 0")
    List<BookIssue> findOverdueIssuesWithoutFines(@Param("currentDate") LocalDate currentDate);
}