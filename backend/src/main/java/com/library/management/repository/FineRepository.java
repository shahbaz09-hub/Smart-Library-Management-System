package com.library.management.repository;

import com.library.management.entity.Fine;
import com.library.management.entity.User;
import com.library.management.entity.BookIssue;
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
public interface FineRepository extends JpaRepository<Fine, Long> {
    
    // User-based queries
    List<Fine> findByUser(User user);
    Page<Fine> findByUser(User user, Pageable pageable);
    
    List<Fine> findByUserAndStatus(User user, Fine.FineStatus status);
    Page<Fine> findByUserAndStatus(User user, Fine.FineStatus status, Pageable pageable);
    
    // BookIssue-based queries
    Optional<Fine> findByBookIssue(BookIssue bookIssue);
    List<Fine> findByBookIssueIn(List<BookIssue> bookIssues);
    
    // Status-based queries
    List<Fine> findByStatus(Fine.FineStatus status);
    Page<Fine> findByStatus(Fine.FineStatus status, Pageable pageable);
    
    // Type-based queries
    List<Fine> findByType(Fine.FineType type);
    Page<Fine> findByType(Fine.FineType type, Pageable pageable);
    
    // Pending fines
    @Query("SELECT f FROM Fine f WHERE f.status IN ('PENDING', 'OVERDUE')")
    List<Fine> findPendingFines();
    
    @Query("SELECT f FROM Fine f WHERE f.status IN ('PENDING', 'OVERDUE')")
    Page<Fine> findPendingFines(Pageable pageable);
    
    // User's pending fines
    @Query("SELECT f FROM Fine f WHERE f.user = :user AND f.status IN ('PENDING', 'OVERDUE')")
    List<Fine> findPendingFinesByUser(@Param("user") User user);
    
    // Overdue fines
    @Query("SELECT f FROM Fine f WHERE f.dueDate < :currentDate AND f.status = 'PENDING'")
    List<Fine> findOverdueFines(@Param("currentDate") LocalDate currentDate);
    
    // Amount-based queries
    @Query("SELECT f FROM Fine f WHERE f.amount >= :minAmount")
    List<Fine> findFinesWithMinAmount(@Param("minAmount") Double minAmount);
    
    @Query("SELECT f FROM Fine f WHERE f.amount BETWEEN :minAmount AND :maxAmount")
    List<Fine> findFinesByAmountRange(@Param("minAmount") Double minAmount, @Param("maxAmount") Double maxAmount);
    
    // Date-based queries
    List<Fine> findByCreatedDateBetween(LocalDate startDate, LocalDate endDate);
    List<Fine> findByPaidDateBetween(LocalDate startDate, LocalDate endDate);
    List<Fine> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
    
    // Search queries
    @Query("SELECT f FROM Fine f WHERE " +
           "LOWER(f.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.user.rollNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.user.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.bookIssue.book.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Fine> searchFines(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Advanced search with filters
    @Query("SELECT f FROM Fine f WHERE " +
           "(:searchTerm IS NULL OR " +
           "LOWER(f.user.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.user.rollNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.bookIssue.book.title) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "(:status IS NULL OR f.status = :status) AND " +
           "(:type IS NULL OR f.type = :type) AND " +
           "(:department IS NULL OR f.user.department = :department) AND " +
           "(:minAmount IS NULL OR f.amount >= :minAmount) AND " +
           "(:maxAmount IS NULL OR f.amount <= :maxAmount)")
    Page<Fine> findFinesWithFilters(
            @Param("searchTerm") String searchTerm,
            @Param("status") Fine.FineStatus status,
            @Param("type") Fine.FineType type,
            @Param("department") String department,
            @Param("minAmount") Double minAmount,
            @Param("maxAmount") Double maxAmount,
            Pageable pageable
    );
    
    // Statistics queries
    @Query("SELECT COUNT(f) FROM Fine f WHERE f.status = :status")
    long countByStatus(@Param("status") Fine.FineStatus status);
    
    @Query("SELECT COUNT(f) FROM Fine f WHERE f.type = :type")
    long countByType(@Param("type") Fine.FineType type);
    
    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.status = :status")
    Double sumAmountByStatus(@Param("status") Fine.FineStatus status);
    
    @Query("SELECT SUM(f.amount) FROM Fine f")
    Double getTotalFineAmount();
    
    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.status = 'PAID'")
    Double getTotalCollectedAmount();
    
    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.status IN ('PENDING', 'OVERDUE')")
    Double getTotalPendingAmount();
    
    // Department-wise statistics
    @Query("SELECT f.user.department, COUNT(f), SUM(f.amount) FROM Fine f WHERE f.user.department IS NOT NULL GROUP BY f.user.department")
    List<Object[]> getFineStatsByDepartment();
    
    // Monthly statistics
    @Query("SELECT YEAR(f.createdDate), MONTH(f.createdDate), COUNT(f), SUM(f.amount) FROM Fine f GROUP BY YEAR(f.createdDate), MONTH(f.createdDate) ORDER BY YEAR(f.createdDate), MONTH(f.createdDate)")
    List<Object[]> getMonthlyFineStatistics();
    
    @Query("SELECT YEAR(f.paidDate), MONTH(f.paidDate), COUNT(f), SUM(f.amount) FROM Fine f WHERE f.paidDate IS NOT NULL GROUP BY YEAR(f.paidDate), MONTH(f.paidDate) ORDER BY YEAR(f.paidDate), MONTH(f.paidDate)")
    List<Object[]> getMonthlyCollectionStatistics();
    
    // Top defaulters
    @Query("SELECT f.user, COUNT(f), SUM(f.amount) FROM Fine f WHERE f.status IN ('PENDING', 'OVERDUE') GROUP BY f.user ORDER BY SUM(f.amount) DESC")
    List<Object[]> findTopDefaulters(Pageable pageable);
    
    // Users with highest fines
    @Query("SELECT f.user, SUM(f.amount) FROM Fine f WHERE f.status IN ('PENDING', 'OVERDUE') GROUP BY f.user ORDER BY SUM(f.amount) DESC")
    List<Object[]> findUsersWithHighestFines(Pageable pageable);
    
    // Payment method statistics
    @Query("SELECT f.paymentMethod, COUNT(f), SUM(f.amount) FROM Fine f WHERE f.paymentMethod IS NOT NULL GROUP BY f.paymentMethod")
    List<Object[]> getPaymentMethodStatistics();
    
    // Waived fines
    List<Fine> findByWaivedBy(User waivedBy);
    
    @Query("SELECT f FROM Fine f WHERE f.status = 'WAIVED' AND f.waivedDate BETWEEN :startDate AND :endDate")
    List<Fine> findWaivedFinesBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Discount-related queries
    @Query("SELECT f FROM Fine f WHERE f.discountApplied > 0")
    List<Fine> findFinesWithDiscount();
    
    @Query("SELECT SUM(f.discountApplied) FROM Fine f WHERE f.discountApplied > 0")
    Double getTotalDiscountAmount();
    
    // Reminder-related queries
    @Query("SELECT f FROM Fine f WHERE f.lastReminderSent IS NULL AND f.status IN ('PENDING', 'OVERDUE')")
    List<Fine> findFinesWithoutReminders();
    
    @Query("SELECT f FROM Fine f WHERE f.lastReminderSent < :date AND f.status IN ('PENDING', 'OVERDUE')")
    List<Fine> findFinesNeedingReminder(@Param("date") LocalDate date);
    
    // Daily collection
    @Query("SELECT SUM(f.amount) FROM Fine f WHERE f.paidDate = :date")
    Double getDailyCollection(@Param("date") LocalDate date);
    
    // Average fine amount
    @Query("SELECT AVG(f.amount) FROM Fine f")
    Double getAverageFineAmount();
    
    @Query("SELECT AVG(f.amount) FROM Fine f WHERE f.type = :type")
    Double getAverageFineAmountByType(@Param("type") Fine.FineType type);
}