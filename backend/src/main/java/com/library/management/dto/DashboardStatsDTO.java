package com.library.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalBooks;
    private Long activeUsers;
    private Long pendingFines;
    private Long totalRevenue;
    private Long issuedBooks;
    private Long overdueBooks;
    private Long availableBooks;
    private Long totalFines;
}
