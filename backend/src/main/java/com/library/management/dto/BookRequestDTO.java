package com.library.management.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long bookId;
    private String bookTitle;
    private String requestDate;
    private String status;
    private String priority;
    private String notes;
}
