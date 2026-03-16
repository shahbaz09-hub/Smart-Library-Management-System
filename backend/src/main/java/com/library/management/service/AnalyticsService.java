package com.library.management.service;

import com.library.management.dto.AnalyticsDTO;
import com.library.management.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookIssueRepository bookIssueRepository;

    @Autowired
    private FineRepository fineRepository;

    public AnalyticsDTO getDashboardAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();
        
        // Books by department
        Map<String, Long> booksByDept = bookRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                book -> book.getDepartment() != null ? book.getDepartment() : "Other",
                Collectors.counting()
            ));
        analytics.setBooksByDepartment(booksByDept);
        
        // Most borrowed books
        List<AnalyticsDTO.BookAnalytics> mostBorrowed = bookIssueRepository.findAll().stream()
            .collect(Collectors.groupingBy(issue -> issue.getBook(), Collectors.counting()))
            .entrySet().stream()
            .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
            .limit(10)
            .map(entry -> {
                var book = (com.library.management.entity.Book) entry.getKey();
                return new AnalyticsDTO.BookAnalytics(
                    book.getId(),
                    book.getTitle(),
                    book.getAuthor(),
                    entry.getValue(),
                    0.0
                );
            })
            .collect(Collectors.toList());
        analytics.setMostBorrowedBooks(mostBorrowed);
        
        // Users by department
        Map<String, Long> usersByDept = userRepository.findAll().stream()
            .filter(user -> user.getDepartment() != null)
            .collect(Collectors.groupingBy(
                user -> user.getDepartment(),
                Collectors.counting()
            ));
        analytics.setUsersByDepartment(usersByDept);
        
        // Fines by status
        Map<String, Long> finesByStatus = fineRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                fine -> fine.getStatus().toString(),
                Collectors.counting()
            ));
        analytics.setFinesByStatus(finesByStatus);
        
        return analytics;
    }

    public List<AnalyticsDTO.BookAnalytics> getPopularBooks() {
        return bookRepository.findAll().stream()
            .sorted((b1, b2) -> Integer.compare(b2.getReviewCount(), b1.getReviewCount()))
            .limit(10)
            .map(book -> new AnalyticsDTO.BookAnalytics(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                (long) book.getReviewCount(),
                book.getRating()
            ))
            .collect(Collectors.toList());
    }
}
