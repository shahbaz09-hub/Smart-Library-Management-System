package com.library.management.repository;

import com.library.management.entity.Notification;
import com.library.management.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    // User-based queries
    List<Notification> findByUser(User user);
    Page<Notification> findByUser(User user, Pageable pageable);
    Page<Notification> findByUserId(Long userId, Pageable pageable);
    List<Notification> findByUserIdAndIsRead(Long userId, Boolean isRead);
    long countByUserIdAndIsRead(Long userId, Boolean isRead);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user ORDER BY n.createdAt DESC")
    List<Notification> findByUserOrderByCreatedAtDesc(@Param("user") User user);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user ORDER BY n.createdAt DESC")
    Page<Notification> findByUserOrderByCreatedAtDesc(@Param("user") User user, Pageable pageable);
    
    // Read/Unread queries
    List<Notification> findByUserAndIsRead(User user, Boolean isRead);
    Page<Notification> findByUserAndIsRead(User user, Boolean isRead, Pageable pageable);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findUnreadByUser(@Param("user") User user);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.isRead = false ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadByUser(@Param("user") User user, Pageable pageable);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    long countUnreadByUser(@Param("user") User user);
    
    // Type-based queries
    List<Notification> findByType(Notification.NotificationType type);
    List<Notification> findByUserAndType(User user, Notification.NotificationType type);
    
    // Priority-based queries
    List<Notification> findByPriority(Notification.Priority priority);
    List<Notification> findByUserAndPriority(User user, Notification.Priority priority);
    
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.priority IN ('HIGH', 'URGENT') AND n.isRead = false ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findUrgentUnreadByUser(@Param("user") User user);
    
    // Date-based queries
    List<Notification> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Notification> findByUserAndCreatedAtBetween(User user, LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT n FROM Notification n WHERE n.createdAt >= :date ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotifications(@Param("date") LocalDateTime date);
    
    // Combined filters
    @Query("SELECT n FROM Notification n WHERE " +
           "n.user = :user AND " +
           "(:type IS NULL OR n.type = :type) AND " +
           "(:priority IS NULL OR n.priority = :priority) AND " +
           "(:isRead IS NULL OR n.isRead = :isRead) AND " +
           "(:startDate IS NULL OR n.createdAt >= :startDate) AND " +
           "(:endDate IS NULL OR n.createdAt <= :endDate) " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findNotificationsWithFilters(
            @Param("user") User user,
            @Param("type") Notification.NotificationType type,
            @Param("priority") Notification.Priority priority,
            @Param("isRead") Boolean isRead,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable
    );
    
    // Statistics queries
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.type = :type")
    long countByType(@Param("type") Notification.NotificationType type);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.priority = :priority")
    long countByPriority(@Param("priority") Notification.Priority priority);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.isRead = :isRead")
    long countByReadStatus(@Param("isRead") Boolean isRead);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.createdAt >= :date")
    long countNotificationsAfter(@Param("date") LocalDateTime date);
    
    // Type-wise statistics
    @Query("SELECT n.type, COUNT(n) FROM Notification n GROUP BY n.type")
    List<Object[]> countNotificationsByType();
    
    // Priority-wise statistics
    @Query("SELECT n.priority, COUNT(n) FROM Notification n GROUP BY n.priority")
    List<Object[]> countNotificationsByPriority();
    
    // Daily statistics
    @Query("SELECT DATE(n.createdAt), COUNT(n) FROM Notification n GROUP BY DATE(n.createdAt) ORDER BY DATE(n.createdAt) DESC")
    List<Object[]> getDailyNotificationStats();
    
    // User engagement statistics
    @Query("SELECT n.user, COUNT(n), SUM(CASE WHEN n.isRead = true THEN 1 ELSE 0 END) FROM Notification n GROUP BY n.user")
    List<Object[]> getUserEngagementStats();
    
    // Cleanup queries - old read notifications
    @Query("SELECT n FROM Notification n WHERE n.isRead = true AND n.readAt < :date")
    List<Notification> findOldReadNotifications(@Param("date") LocalDateTime date);
    
    // Bulk operations support
    @Query("SELECT n FROM Notification n WHERE n.user = :user AND n.isRead = false")
    List<Notification> findAllUnreadByUser(@Param("user") User user);
    
    // Related entity queries
    @Query("SELECT n FROM Notification n WHERE n.relatedBook.id = :bookId")
    List<Notification> findByRelatedBookId(@Param("bookId") Long bookId);
    
    @Query("SELECT n FROM Notification n WHERE n.relatedBookIssue.id = :bookIssueId")
    List<Notification> findByRelatedBookIssueId(@Param("bookIssueId") Long bookIssueId);
    
    @Query("SELECT n FROM Notification n WHERE n.relatedFine.id = :fineId")
    List<Notification> findByRelatedFineId(@Param("fineId") Long fineId);
    
    // System-wide notifications (for admins)
    @Query("SELECT n FROM Notification n WHERE n.priority = 'URGENT' AND n.isRead = false ORDER BY n.createdAt DESC")
    List<Notification> findSystemUrgentNotifications();
    
    // Recent activity for dashboard
    @Query("SELECT n FROM Notification n WHERE n.createdAt >= :date ORDER BY n.createdAt DESC")
    List<Notification> findRecentActivity(@Param("date") LocalDateTime date, Pageable pageable);
    
    // Notification summary for users
    @Query("SELECT n.type, COUNT(n), SUM(CASE WHEN n.isRead = false THEN 1 ELSE 0 END) FROM Notification n WHERE n.user = :user GROUP BY n.type")
    List<Object[]> getNotificationSummaryForUser(@Param("user") User user);
}