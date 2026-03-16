package com.library.management.repository;

import com.library.management.entity.BookRequest;
import com.library.management.entity.User;
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
public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    
    // User-based queries
    List<BookRequest> findByUser(User user);
    Page<BookRequest> findByUser(User user, Pageable pageable);
    Page<BookRequest> findByUserId(Long userId, Pageable pageable);
    
    List<BookRequest> findByUserAndStatus(User user, BookRequest.RequestStatus status);
    Page<BookRequest> findByUserAndStatus(User user, BookRequest.RequestStatus status, Pageable pageable);
    
    // Book-based queries
    List<BookRequest> findByBook(Book book);
    Page<BookRequest> findByBook(Book book, Pageable pageable);
    
    List<BookRequest> findByBookAndStatus(Book book, BookRequest.RequestStatus status);
    
    // Status-based queries
    List<BookRequest> findByStatus(BookRequest.RequestStatus status);
    Page<BookRequest> findByStatus(BookRequest.RequestStatus status, Pageable pageable);
    
    // Priority-based queries
    List<BookRequest> findByPriority(BookRequest.Priority priority);
    Page<BookRequest> findByPriority(BookRequest.Priority priority, Pageable pageable);
    
    // Pending requests
    @Query("SELECT br FROM BookRequest br WHERE br.status = 'PENDING' ORDER BY br.priority DESC, br.requestDate ASC")
    List<BookRequest> findPendingRequestsOrderedByPriority();
    
    @Query("SELECT br FROM BookRequest br WHERE br.status = 'PENDING' ORDER BY br.priority DESC, br.requestDate ASC")
    Page<BookRequest> findPendingRequestsOrderedByPriority(Pageable pageable);
    
    // High priority pending requests
    @Query("SELECT br FROM BookRequest br WHERE br.status = 'PENDING' AND br.priority IN ('HIGH', 'URGENT') ORDER BY br.priority DESC, br.requestDate ASC")
    List<BookRequest> findHighPriorityPendingRequests();
    
    // User's active request for a book
    @Query("SELECT br FROM BookRequest br WHERE br.user = :user AND br.book = :book AND br.status IN ('PENDING', 'APPROVED')")
    Optional<BookRequest> findActiveRequestByUserAndBook(@Param("user") User user, @Param("book") Book book);
    
    // Processed by librarian
    List<BookRequest> findByProcessedBy(User processedBy);
    Page<BookRequest> findByProcessedBy(User processedBy, Pageable pageable);
    
    // Date-based queries
    List<BookRequest> findByRequestDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<BookRequest> findByProcessedDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Search queries
    @Query("SELECT br FROM BookRequest br WHERE " +
           "LOWER(br.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(br.user.rollNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(br.book.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(br.book.isbn) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<BookRequest> searchRequests(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Advanced search with filters
    @Query("SELECT br FROM BookRequest br WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(br.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(br.user.rollNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(br.book.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:status IS NULL OR br.status = :status) AND " +
           "(:priority IS NULL OR br.priority = :priority) AND " +
           "(:department IS NULL OR br.user.department = :department) AND " +
           "(:startDate IS NULL OR br.requestDate >= :startDate) AND " +
           "(:endDate IS NULL OR br.requestDate <= :endDate)")
    Page<BookRequest> findRequestsWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("status") BookRequest.RequestStatus status,
            @Param("priority") BookRequest.Priority priority,
            @Param("department") String department,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
    
    // Statistics queries
    @Query("SELECT COUNT(br) FROM BookRequest br WHERE br.status = :status")
    long countByStatus(@Param("status") BookRequest.RequestStatus status);
    
    @Query("SELECT COUNT(br) FROM BookRequest br WHERE br.priority = :priority")
    long countByPriority(@Param("priority") BookRequest.Priority priority);
    
    @Query("SELECT COUNT(br) FROM BookRequest br WHERE br.requestDate >= :date")
    long countRequestsAfter(@Param("date") LocalDateTime date);
    
    // Department-wise statistics
    @Query("SELECT br.user.department, COUNT(br) FROM BookRequest br WHERE br.user.department IS NOT NULL GROUP BY br.user.department")
    List<Object[]> countRequestsByDepartment();
    
    // Status-wise statistics
    @Query("SELECT br.status, COUNT(br) FROM BookRequest br GROUP BY br.status")
    List<Object[]> countRequestsByStatus();
    
    // Priority-wise statistics
    @Query("SELECT br.priority, COUNT(br) FROM BookRequest br GROUP BY br.priority")
    List<Object[]> countRequestsByPriority();
    
    // Monthly statistics
    @Query("SELECT YEAR(br.requestDate), MONTH(br.requestDate), COUNT(br) FROM BookRequest br GROUP BY YEAR(br.requestDate), MONTH(br.requestDate) ORDER BY YEAR(br.requestDate), MONTH(br.requestDate)")
    List<Object[]> getMonthlyRequestStatistics();
    
    // Most requested books
    @Query("SELECT br.book, COUNT(br) as requestCount FROM BookRequest br GROUP BY br.book ORDER BY requestCount DESC")
    List<Object[]> findMostRequestedBooks(Pageable pageable);
    
    // Users with most requests
    @Query("SELECT br.user, COUNT(br) as requestCount FROM BookRequest br GROUP BY br.user ORDER BY requestCount DESC")
    List<Object[]> findUsersWithMostRequests(Pageable pageable);
    
    // Pending requests by department
    @Query("SELECT br FROM BookRequest br WHERE br.status = 'PENDING' AND br.user.department = :department ORDER BY br.priority DESC, br.requestDate ASC")
    List<BookRequest> findPendingRequestsByDepartment(@Param("department") String department);
    
    // Old pending requests (need attention)
    @Query("SELECT br FROM BookRequest br WHERE br.status = 'PENDING' AND br.requestDate < :date")
    List<BookRequest> findOldPendingRequests(@Param("date") LocalDateTime date);
    
    // Approved but not fulfilled requests
    @Query("SELECT br FROM BookRequest br WHERE br.status = 'APPROVED' AND br.processedDate < :date")
    List<BookRequest> findApprovedButNotFulfilledRequests(@Param("date") LocalDateTime date);
    
    // Processing time analysis
    @Query("SELECT AVG(TIMESTAMPDIFF(HOUR, br.requestDate, br.processedDate)) FROM BookRequest br WHERE br.processedDate IS NOT NULL")
    Double getAverageProcessingTimeInHours();
    
    // Librarian performance
    @Query("SELECT br.processedBy, COUNT(br), AVG(TIMESTAMPDIFF(HOUR, br.requestDate, br.processedDate)) FROM BookRequest br WHERE br.processedBy IS NOT NULL GROUP BY br.processedBy")
    List<Object[]> getLibrarianPerformanceStats();
    
    // Rejection analysis
    @Query("SELECT br.rejectionReason, COUNT(br) FROM BookRequest br WHERE br.status = 'REJECTED' AND br.rejectionReason IS NOT NULL GROUP BY br.rejectionReason")
    List<Object[]> getRejectionReasonStats();
    
    // Recent requests
    @Query("SELECT br FROM BookRequest br ORDER BY br.requestDate DESC")
    List<BookRequest> findRecentRequests(Pageable pageable);
    
    // Requests needing urgent attention
    @Query("SELECT br FROM BookRequest br WHERE br.status = 'PENDING' AND (br.priority = 'URGENT' OR br.requestDate < :urgentDate)")
    List<BookRequest> findRequestsNeedingUrgentAttention(@Param("urgentDate") LocalDateTime urgentDate);
}