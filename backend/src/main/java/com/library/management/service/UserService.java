package com.library.management.service;

import com.library.management.dto.StudentRegistrationRequest;
import com.library.management.dto.UserDTO;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.exception.DuplicateResourceException;
import com.library.management.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        
        // Update last active date
        user.setLastActiveDate(LocalDateTime.now());
        userRepository.save(user);
        
        return user;
    }
    
    public UserDTO createUser(UserDTO userDTO) {
        // Check if email already exists
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + userDTO.getEmail());
        }
        
        // Check if roll number already exists (for students)
        if (userDTO.getRollNumber() != null && userRepository.existsByRollNumber(userDTO.getRollNumber())) {
            throw new DuplicateResourceException("Roll number already exists: " + userDTO.getRollNumber());
        }
        
        User user = modelMapper.map(userDTO, User.class);
        user.setRegistrationDate(LocalDateTime.now());
        user.setStatus(User.UserStatus.ACTIVE);
        
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }
    
    public UserDTO registerStudent(StudentRegistrationRequest request) {
        // Validate password match
        if (!request.isPasswordMatching()) {
            throw new IllegalArgumentException("Passwords do not match");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + request.getEmail());
        }
        
        // Check if roll number already exists
        if (userRepository.existsByRollNumber(request.getRollNumber())) {
            throw new DuplicateResourceException("Roll number already exists: " + request.getRollNumber());
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRollNumber(request.getRollNumber());
        user.setDepartment(request.getDepartment());
        user.setSemester(request.getSemester());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole(User.Role.USER);
        user.setStatus(User.UserStatus.ACTIVE);
        user.setRegistrationDate(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }
    
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return modelMapper.map(user, UserDTO.class);
    }
    
    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return modelMapper.map(user, UserDTO.class);
    }
    
    public UserDTO getUserByRollNumber(String rollNumber) {
        User user = userRepository.findByRollNumber(rollNumber)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with roll number: " + rollNumber));
        return modelMapper.map(user, UserDTO.class);
    }
    
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(user -> modelMapper.map(user, UserDTO.class));
    }
    
    public Page<UserDTO> searchUsers(String searchTerm, Pageable pageable) {
        Page<User> users = userRepository.searchUsers(searchTerm, pageable);
        return users.map(user -> modelMapper.map(user, UserDTO.class));
    }
    
    public Page<UserDTO> getUsersWithFilters(String searchTerm, User.Role role, 
                                           User.UserStatus status, String department, 
                                           Pageable pageable) {
        Page<User> users = userRepository.findUsersWithFilters(searchTerm, role, status, department, pageable);
        return users.map(user -> modelMapper.map(user, UserDTO.class));
    }
    
    public List<UserDTO> getUsersByRole(User.Role role) {
        List<User> users = userRepository.findByRole(role);
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getUsersByDepartment(String department) {
        List<User> users = userRepository.findByDepartment(department);
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }
    
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Check email uniqueness if changed
        if (!existingUser.getEmail().equals(userDTO.getEmail()) && 
            userRepository.existsByEmail(userDTO.getEmail())) {
            throw new DuplicateResourceException("Email already exists: " + userDTO.getEmail());
        }
        
        // Check roll number uniqueness if changed
        if (userDTO.getRollNumber() != null && 
            !userDTO.getRollNumber().equals(existingUser.getRollNumber()) &&
            userRepository.existsByRollNumber(userDTO.getRollNumber())) {
            throw new DuplicateResourceException("Roll number already exists: " + userDTO.getRollNumber());
        }
        
        // Update fields
        existingUser.setName(userDTO.getName());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setRollNumber(userDTO.getRollNumber());
        existingUser.setDepartment(userDTO.getDepartment());
        existingUser.setSemester(userDTO.getSemester());
        existingUser.setPhoneNumber(userDTO.getPhoneNumber());
        existingUser.setAddress(userDTO.getAddress());
        
        if (userDTO.getStatus() != null) {
            existingUser.setStatus(userDTO.getStatus());
        }
        
        User updatedUser = userRepository.save(existingUser);
        return modelMapper.map(updatedUser, UserDTO.class);
    }
    
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        // Check if user has active book issues or pending fines
        if (user.getBookIssues() != null && !user.getBookIssues().isEmpty()) {
            throw new IllegalStateException("Cannot delete user with active book issues");
        }
        
        if (user.getTotalFines() > 0) {
            throw new IllegalStateException("Cannot delete user with pending fines");
        }
        
        userRepository.delete(user);
    }
    
    public UserDTO suspendUser(Long id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setStatus(User.UserStatus.SUSPENDED);
        User updatedUser = userRepository.save(user);
        
        return modelMapper.map(updatedUser, UserDTO.class);
    }
    
    public UserDTO activateUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        
        user.setStatus(User.UserStatus.ACTIVE);
        User updatedUser = userRepository.save(user);
        
        return modelMapper.map(updatedUser, UserDTO.class);
    }
    
    public void updateUserFines(Long userId, Double fineAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        user.setTotalFines(user.getTotalFines() + fineAmount);
        userRepository.save(user);
    }
    
    public List<UserDTO> getUsersWithFines() {
        List<User> users = userRepository.findUsersWithFines();
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }
    
    public List<UserDTO> getInactiveUsers(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);
        List<User> users = userRepository.findInactiveUsers(cutoffDate);
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }
    
    // Statistics methods
    public long getTotalUserCount() {
        return userRepository.count();
    }
    
    public long getUserCountByRole(User.Role role) {
        return userRepository.countByRole(role);
    }
    
    public long getUserCountByStatus(User.UserStatus status) {
        return userRepository.countByStatus(status);
    }
    
    public UserDTO updateProfileByEmail(String email, UserDTO userDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setName(userDTO.getName());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setAddress(userDTO.getAddress());
        
        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, UserDTO.class);
    }
    
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}