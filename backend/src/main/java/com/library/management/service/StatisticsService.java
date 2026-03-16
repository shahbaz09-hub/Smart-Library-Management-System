package com.library.management.service;

import com.library.management.dto.DashboardStatsDTO;
import com.library.management.entity.Book;
import com.library.management.entity.BookIssue;
import com.library.management.entity.Fine;
import com.library.management.entity.User;
import com.library.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class StatisticsService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private BookIssueRepository bookIssueRepository;

    public DashboardStatsDTO getAdminStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        stats.setTotalBooks(bookRepository.count());
        stats.setActiveUsers(userRepository.countByStatus(User.UserStatus.ACTIVE));
        
        Long pendingFines = fineRepository.findAll().stream()
            .filter(f -> f.getStatus() == Fine.FineStatus.PENDING || f.getStatus() == Fine.FineStatus.OVERDUE)
            .mapToLong(f -> f.getAmount().longValue())
            .sum();
        stats.setPendingFines(pendingFines);
        
        Long totalRevenue = fineRepository.findAll().stream()
            .filter(f -> f.getStatus() == Fine.FineStatus.PAID)
            .mapToLong(f -> f.getAmount().longValue())
            .sum();
        stats.setTotalRevenue(totalRevenue);
        
        stats.setIssuedBooks(bookIssueRepository.findAll().stream()
            .filter(issue -> issue.getReturnDate() == null)
            .count());
        
        stats.setOverdueBooks(bookIssueRepository.findAll().stream()
            .filter(issue -> issue.getReturnDate() == null && 
                           issue.getDueDate().isBefore(LocalDate.now()))
            .count());
        
        stats.setAvailableBooks(bookRepository.findAll().stream()
            .filter(book -> book.getStatus() == Book.BookStatus.AVAILABLE)
            .count());
        
        stats.setTotalFines(fineRepository.count());
        
        return stats;
    }

    public DashboardStatsDTO getLibrarianStats() {
        return getAdminStats(); // Same stats for now
    }

    public DashboardStatsDTO getUserStats(Long userId) {
        DashboardStatsDTO stats = new DashboardStatsDTO();
        
        stats.setIssuedBooks(bookIssueRepository.findAll().stream()
            .filter(issue -> issue.getUser().getId().equals(userId) && issue.getReturnDate() == null)
            .count());
        
        stats.setOverdueBooks(bookIssueRepository.findAll().stream()
            .filter(issue -> issue.getUser().getId().equals(userId) && 
                           issue.getReturnDate() == null && 
                           issue.getDueDate().isBefore(LocalDate.now()))
            .count());
        
        Long userFines = fineRepository.findAll().stream()
            .filter(f -> f.getUser().getId().equals(userId) && 
                        (f.getStatus() == Fine.FineStatus.PENDING || f.getStatus() == Fine.FineStatus.OVERDUE))
            .mapToLong(f -> f.getAmount().longValue())
            .sum();
        stats.setPendingFines(userFines);
        
        return stats;
    }
}
