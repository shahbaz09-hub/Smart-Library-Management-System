package com.library.management.security;

import com.library.management.config.CorsConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Autowired
    @Lazy
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Autowired
    private CorsConfig corsConfig;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, UserDetailsService userDetailsService) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfig.corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/auth/**", "/api/auth/**").permitAll()
                .requestMatchers("/public/**", "/api/public/**").permitAll()
                .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/api/swagger-ui/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/api/v3/api-docs/**", "/api-docs/**", "/api/api-docs/**").permitAll()
                .requestMatchers("/health", "/api/health").permitAll()
                
                // Admin only endpoints
                .requestMatchers("/admin/**", "/api/admin/**").hasRole("ADMIN")
                
                // Librarian and Admin endpoints
                .requestMatchers("/librarian/**", "/api/librarian/**").hasAnyRole("LIBRARIAN", "ADMIN")
                
                // User endpoints (all authenticated users)
                .requestMatchers("/user/**", "/api/user/**").hasAnyRole("USER", "LIBRARIAN", "ADMIN")
                
                // Books endpoints - different access levels
                .requestMatchers(HttpMethod.GET, "/books/search", "/books/browse", "/books/*", "/api/books/search", "/api/books/browse", "/api/books/*").permitAll()
                .requestMatchers(HttpMethod.POST, "/books", "/api/books").hasAnyRole("LIBRARIAN", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/books/*", "/api/books/*").hasAnyRole("LIBRARIAN", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/books/*", "/api/books/*").hasRole("ADMIN")
                
                // All other requests need authentication
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider(userDetailsService))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}