package com.ketki.smart_parking_application.service;

import com.ketki.smart_parking_application.dto.AuthRequest;
import com.ketki.smart_parking_application.dto.AuthResponse;
import com.ketki.smart_parking_application.dto.RegisterRequest;
import com.ketki.smart_parking_application.entity.User;
import com.ketki.smart_parking_application.exception.ResourceNotFoundException;
import com.ketki.smart_parking_application.repository.UserRepository;
import com.ketki.smart_parking_application.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    // ─────────────────────────────────────────
    // Register a new user
    // ─────────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {

        // Check if username already taken
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }

        // Check if email already taken
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Build and save the new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash
        user.setRole(User.Role.USER); // Default role is USER

        userRepository.save(user);

        // Generate and return JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }

    // ─────────────────────────────────────────
    // Login an existing user
    // ─────────────────────────────────────────
    public AuthResponse login(AuthRequest request) {

        // Authenticate — throws exception if credentials wrong
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Load user from DB
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Generate and return JWT token
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponse(token, user.getUsername(), user.getRole().name());
    }
}