package com.library.management.service;

import com.library.management.entity.Fine;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.repository.FineRepository;
import com.library.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@Transactional
public class FineService {

    @Autowired
    private FineRepository fineRepository;

    @Autowired
    private UserRepository userRepository;

    public Page<Fine> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return fineRepository.findAll(pageable);
        }

    public Page<Fine> getByUser(Long userId, int page, int size) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Pageable pageable = PageRequest.of(page, size);
        return fineRepository.findByUser(user, pageable);
    }

    public Fine pay(Long fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found: " + fineId));
        if (fine.getStatus() == Fine.FineStatus.PAID) {
            return fine;
        }
        fine.setStatus(Fine.FineStatus.PAID);
        fine.setPaidDate(LocalDate.now());
        return fineRepository.save(fine);
    }

    public Fine waive(Long fineId) {
        Fine fine = fineRepository.findById(fineId)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found: " + fineId));
        fine.setStatus(Fine.FineStatus.WAIVED);
        fine.setWaivedDate(LocalDate.now());
        return fineRepository.save(fine);
    }
}
