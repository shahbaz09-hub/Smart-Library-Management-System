package com.library.management.service;

import com.library.management.entity.Book;
import com.library.management.entity.BookIssue;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookIssueRepository;
import com.library.management.repository.BookRepository;
import com.library.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class IssueService {

    @Autowired
    private BookIssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Value("${library.book.max-issue-days:14}")
    private int maxIssueDays;

    @Value("${library.book.max-renewals:2}")
    private int maxRenewals;

    public BookIssue issueBook(Long userId, Long bookId, Long issuedById) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found: " + bookId));
        User librarian = userRepository.findById(issuedById)
                .orElseThrow(() -> new ResourceNotFoundException("IssuedBy (librarian) not found: " + issuedById));

        if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("Book not available to issue");
        }

        BookIssue issue = new BookIssue();
        issue.setUser(user);
        issue.setBook(book);
        issue.setIssuedBy(librarian);
        issue.setIssueDate(LocalDate.now());
        issue.setDueDate(LocalDate.now().plusDays(maxIssueDays));
        issue.setStatus(BookIssue.IssueStatus.ISSUED);
        issue.setRenewCount(0);
        issue.setMaxRenewals(maxRenewals);

        // adjust stock
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        book.setIssuedCopies((book.getIssuedCopies() == null ? 0 : book.getIssuedCopies()) + 1);
        bookRepository.save(book);

        return issueRepository.save(issue);
    }

    public BookIssue returnBook(Long issueId, Long returnedToId) {
        BookIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found: " + issueId));
        User librarian = userRepository.findById(returnedToId)
                .orElseThrow(() -> new ResourceNotFoundException("ReturnedTo (librarian) not found: " + returnedToId));

        if (issue.getStatus() == BookIssue.IssueStatus.RETURNED) {
            return issue;
        }

        issue.setReturnedTo(librarian);
        issue.setReturnDate(LocalDate.now());
        issue.setStatus(BookIssue.IssueStatus.RETURNED);

        // restore stock
        Book book = issue.getBook();
        book.setAvailableCopies((book.getAvailableCopies() == null ? 0 : book.getAvailableCopies()) + 1);
        bookRepository.save(book);

        return issueRepository.save(issue);
    }

    public BookIssue renew(Long issueId) {
        BookIssue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found: " + issueId));
        if (issue.getRenewCount() >= issue.getMaxRenewals()) {
            throw new IllegalStateException("Max renewals reached");
        }
        if (issue.getStatus() == BookIssue.IssueStatus.RETURNED) {
            throw new IllegalStateException("Cannot renew a returned issue");
        }
        issue.setDueDate(issue.getDueDate().plusDays(maxIssueDays));
        issue.setRenewCount(issue.getRenewCount() + 1);
        issue.setStatus(BookIssue.IssueStatus.RENEWED);
        return issueRepository.save(issue);
    }

    public Page<BookIssue> getUserIssues(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Pageable pageable = PageRequest.of(page, size);
        return issueRepository.findByUser(user, pageable);
    }
}
