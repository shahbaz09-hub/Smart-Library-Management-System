package com.library.management.dto;

import com.library.management.entity.User;

public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private UserDTO user;
    private String message;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, UserDTO user) {
        this.token = token;
        this.user = user;
        this.message = "Authentication successful";
    }
    
    public AuthResponse(String token, UserDTO user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }
    
    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}