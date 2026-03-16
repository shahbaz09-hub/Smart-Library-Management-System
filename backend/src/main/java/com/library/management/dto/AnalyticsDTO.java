package com.library.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private Map<String, Long> booksByDepartment;
    private List<BookAnalytics> mostBorrowedBooks;
    private List<BookAnalytics> popularBooks;
    private Map<String, Long> usersByDepartment;
    private Map<String, Long> finesByStatus;
    private List<TrendData> borrowingTrends;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookAnalytics {
        private Long bookId;
        private String title;
        private String author;
        private Long count;
        private Double rating;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TrendData {
        private String period;
        private Long count;
    }
}
