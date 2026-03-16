package com.library.management.service;

import com.library.management.dto.BookDTO;
import com.library.management.entity.Book;
import com.library.management.exception.DuplicateResourceException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ModelMapper modelMapper;

    public BookDTO create(BookDTO dto) {
        if (dto.getIsbn() != null && bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new DuplicateResourceException("Book with ISBN already exists: " + dto.getIsbn());
        }
        Book entity = modelMapper.map(dto, Book.class);
        entity.setAddedDate(LocalDateTime.now());
        if (entity.getAvailableCopies() == null && entity.getTotalCopies() != null) {
            entity.setAvailableCopies(entity.getTotalCopies());
        }
        Book saved = bookRepository.save(entity);
        return modelMapper.map(saved, BookDTO.class);
    }

    public BookDTO update(Long id, BookDTO dto) {
        Book existing = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));

        if (dto.getIsbn() != null && !dto.getIsbn().equals(existing.getIsbn()) && bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new DuplicateResourceException("Book with ISBN already exists: " + dto.getIsbn());
        }

        // Map updatable fields
        existing.setTitle(dto.getTitle());
        existing.setAuthor(dto.getAuthor());
        existing.setPublisher(dto.getPublisher());
        existing.setPublishYear(dto.getPublishYear());
        existing.setIsbn(dto.getIsbn());
        existing.setDepartment(dto.getDepartment());
        existing.setSubject(dto.getSubject());
        existing.setLanguage(dto.getLanguage());
        existing.setStatus(dto.getStatus());
        existing.setRating(dto.getRating());
        existing.setReviewCount(dto.getReviewCount());
        existing.setTotalCopies(dto.getTotalCopies());
        existing.setAvailableCopies(dto.getAvailableCopies());
        existing.setIssuedCopies(dto.getIssuedCopies());

        Book saved = bookRepository.save(existing);
        return modelMapper.map(saved, BookDTO.class);
    }

    public void delete(Long id) {
        Book existing = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        bookRepository.delete(existing);
    }

    public BookDTO getById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
        return modelMapper.map(book, BookDTO.class);
    }

    public Page<BookDTO> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findAll(pageable).map(b -> modelMapper.map(b, BookDTO.class));
    }

    public Page<BookDTO> search(String q, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.searchBooks(q == null ? "" : q, pageable)
                .map(b -> modelMapper.map(b, BookDTO.class));
    }

    public Page<BookDTO> browse(String department, String subject, Book.BookStatus status, boolean availableOnly,
                                int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findBooksWithFilters(null, department, subject, status, availableOnly, pageable)
                .map(b -> modelMapper.map(b, BookDTO.class));
    }
}
