package com.library.management.repository;

import com.library.management.entity.BookReservation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookReservationRepository extends JpaRepository<BookReservation, Long> {
    Page<BookReservation> findByUserId(Long userId, Pageable pageable);
    List<BookReservation> findByBookId(Long bookId);
    List<BookReservation> findByStatus(BookReservation.ReservationStatus status);
}
