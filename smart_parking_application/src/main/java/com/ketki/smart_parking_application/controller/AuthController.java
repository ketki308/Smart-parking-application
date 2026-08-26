package com.ketki.smart_parking_application.controller;

import com.ketki.smart_parking_application.dto.AuthRequest;
import com.ketki.smart_parking_application.dto.AuthResponse;
import com.ketki.smart_parking_application.dto.RegisterRequest;
import com.ketki.smart_parking_application.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ─────────────────────────────────────────
    // POST /api/auth/register
    // Body: { "username": "", "email": "", "password": "" }
    // ─────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // ─────────────────────────────────────────
    // POST /api/auth/login
    // Body: { "username": "", "password": "" }
    // ─────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}