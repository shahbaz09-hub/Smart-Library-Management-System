package com.library.management.service;

import com.library.management.entity.Book;
import com.library.management.entity.BookRequest;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BookRequestRepository;
import com.library.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BookRequestService {

    @Autowired
    private BookRequestRepository bookRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    public BookRequest createRequest(Long userId, Long bookId, String notes) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        BookRequest request = new BookRequest(user, book, BookRequest.Priority.MEDIUM);
        request.setRequestNotes(notes);
        return bookRequestRepository.save(request);
    }

    public Page<BookRequest> getAllRequests(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestDate").descending());
        return bookRequestRepository.findAll(pageable);
    }

    public List<BookRequest> getPendingRequests() {
        return bookRequestRepository.findByStatus(BookRequest.RequestStatus.PENDING);
    }

    public Page<BookRequest> getUserRequests(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("requestDate").descending());
        return bookRequestRepository.findByUserId(userId, pageable);
    }

    public BookRequest approveRequest(Long requestId, Long processedBy) {
        BookRequest request = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        User processor = userRepository.findById(processedBy)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        request.approve(processor);
        return bookRequestRepository.save(request);
    }

    public BookRequest rejectRequest(Long requestId, Long processedBy, String reason) {
        BookRequest request = bookRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        User processor = userRepository.findById(processedBy)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        request.reject(processor, reason);
        return bookRequestRepository.save(request);
    }

    public BookRequest getRequestById(Long id) {
        return bookRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
    }
}
