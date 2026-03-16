package com.library.management.service;

import com.library.management.entity.Book;
import com.library.management.entity.BookReservation;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BookReservationRepository;
import com.library.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReservationService {

    @Autowired
    private BookReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    public BookReservation createReservation(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        BookReservation reservation = new BookReservation();
        reservation.setUser(user);
        reservation.setBook(book);
        reservation.setExpiryDate(LocalDateTime.now().plusDays(7));
        
        return reservationRepository.save(reservation);
    }

    public Page<BookReservation> getUserReservations(Long userId, Pageable pageable) {
        return reservationRepository.findByUserId(userId, pageable);
    }

    public List<BookReservation> getBookReservations(Long bookId) {
        return reservationRepository.findByBookId(bookId);
    }

    public void cancelReservation(Long reservationId) {
        BookReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        reservation.setStatus(BookReservation.ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }
}
