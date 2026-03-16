package com.library.management.repository;

import com.library.management.entity.Book;
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
public interface BookRepository extends JpaRepository<Book, Long> {
    
    // Basic queries
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);
    
    // Department-based queries
    List<Book> findByDepartment(String department);
    Page<Book> findByDepartment(String department, Pageable pageable);
    
    // Subject-based queries
    List<Book> findBySubject(String subject);
    Page<Book> findBySubject(String subject, Pageable pageable);
    
    // Status-based queries
    List<Book> findByStatus(Book.BookStatus status);
    Page<Book> findByStatus(Book.BookStatus status, Pageable pageable);
    
    // Availability queries
    @Query("SELECT b FROM Book b WHERE b.availableCopies > 0 AND b.status = 'AVAILABLE'")
    List<Book> findAvailableBooks();
    
    @Query("SELECT b FROM Book b WHERE b.availableCopies > 0 AND b.status = 'AVAILABLE'")
    Page<Book> findAvailableBooks(Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.availableCopies = 0 OR b.status != 'AVAILABLE'")
    List<Book> findUnavailableBooks();
    
    // Search queries
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Book> searchBooks(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Advanced search with filters
    @Query("SELECT b FROM Book b WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:department IS NULL OR b.department = :department) AND " +
           "(:subject IS NULL OR b.subject = :subject) AND " +
           "(:status IS NULL OR b.status = :status) AND " +
           "(:availableOnly = false OR (b.availableCopies > 0 AND b.status = 'AVAILABLE'))")
    Page<Book> findBooksWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("department") String department,
            @Param("subject") String subject,
            @Param("status") Book.BookStatus status,
            @Param("availableOnly") boolean availableOnly,
            Pageable pageable
    );
    
    // Author-based queries
    List<Book> findByAuthorContainingIgnoreCase(String author);
    Page<Book> findByAuthorContainingIgnoreCase(String author, Pageable pageable);
    
    // Title-based queries
    List<Book> findByTitleContainingIgnoreCase(String title);
    Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    // Year-based queries
    List<Book> findByPublishYear(Integer year);
    List<Book> findByPublishYearBetween(Integer startYear, Integer endYear);
    
    // Rating-based queries
    @Query("SELECT b FROM Book b WHERE b.rating >= :minRating ORDER BY b.rating DESC")
    List<Book> findBooksWithMinRating(@Param("minRating") Double minRating);
    
    @Query("SELECT b FROM Book b ORDER BY b.rating DESC")
    List<Book> findTopRatedBooks(Pageable pageable);
    
    // Popular books queries
    @Query("SELECT b FROM Book b ORDER BY b.reviewCount DESC")
    List<Book> findMostReviewedBooks(Pageable pageable);
    
    @Query("SELECT b FROM Book b ORDER BY b.issuedCopies DESC")
    List<Book> findMostBorrowedBooks(Pageable pageable);
    
    // Recently added books
    @Query("SELECT b FROM Book b ORDER BY b.addedDate DESC")
    List<Book> findRecentlyAddedBooks(Pageable pageable);
    
    @Query("SELECT b FROM Book b WHERE b.addedDate >= :date ORDER BY b.addedDate DESC")
    List<Book> findBooksAddedAfter(@Param("date") LocalDateTime date);
    
    // Statistics queries
    @Query("SELECT COUNT(b) FROM Book b WHERE b.status = :status")
    long countByStatus(@Param("status") Book.BookStatus status);
    
    @Query("SELECT b.department, COUNT(b) FROM Book b GROUP BY b.department")
    List<Object[]> countBooksByDepartment();
    
    @Query("SELECT b.subject, COUNT(b) FROM Book b WHERE b.subject IS NOT NULL GROUP BY b.subject")
    List<Object[]> countBooksBySubject();
    
    @Query("SELECT SUM(b.totalCopies) FROM Book b")
    Long getTotalCopiesCount();
    
    @Query("SELECT SUM(b.availableCopies) FROM Book b")
    Long getAvailableCopiesCount();
    
    @Query("SELECT SUM(b.issuedCopies) FROM Book b")
    Long getIssuedCopiesCount();
    
    // Low stock books
    @Query("SELECT b FROM Book b WHERE b.availableCopies <= :threshold AND b.status = 'AVAILABLE'")
    List<Book> findLowStockBooks(@Param("threshold") Integer threshold);
    
    // Books by publisher
    List<Book> findByPublisherContainingIgnoreCase(String publisher);
    
    // Books by language
    List<Book> findByLanguage(String language);
    
    // Recommendations based on department
    @Query("SELECT b FROM Book b WHERE b.department = :department AND b.rating >= 4.0 AND b.availableCopies > 0 ORDER BY b.rating DESC")
    List<Book> findRecommendedBooksByDepartment(@Param("department") String department, Pageable pageable);
    
    // Books that need attention (damaged, lost, etc.)
    @Query("SELECT b FROM Book b WHERE b.status IN ('MAINTENANCE', 'DAMAGED', 'LOST')")
    List<Book> findBooksNeedingAttention();
}