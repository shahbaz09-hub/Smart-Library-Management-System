package com.library.management.controller;

import com.library.management.entity.Notification;
import com.library.management.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Notifications", description = "Notification management endpoints")
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get user notifications")
    public ResponseEntity<Page<Notification>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, page, size));
    }

    @GetMapping("/unread/{userId}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Get unread notification count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@PathVariable Long userId) {
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(notificationService.markAsRead(id));
    }

    @PutMapping("/read-all/{userId}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Void> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','LIBRARIAN','ADMIN')")
    @Operation(summary = "Delete notification")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    @Operation(summary = "Send notification to user")
    public ResponseEntity<Notification> sendNotification(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String title = request.get("title").toString();
        String message = request.get("message").toString();
        String typeStr = request.getOrDefault("type", "INFO").toString();
        Notification.NotificationType type = Notification.NotificationType.valueOf(typeStr);

        Notification notification = notificationService.createNotification(userId, title, message, type);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Broadcast notification to all users")
    public ResponseEntity<Void> broadcastNotification(@RequestBody Map<String, String> request) {
        String title = request.get("title");
        String message = request.get("message");
        String typeStr = request.getOrDefault("type", "INFO");
        Notification.NotificationType type = Notification.NotificationType.valueOf(typeStr);

        notificationService.broadcastNotification(title, message, type);
        return ResponseEntity.ok().build();
    }
}
