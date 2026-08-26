package com.ketki.smart_parking_application.repository;

import com.ketki.smart_parking_application.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Used during login — find user by username
    Optional<User> findByUsername(String username);

    // Used during registration — check if username already taken
    boolean existsByUsername(String username);

    // Used during registration — check if email already taken
    boolean existsByEmail(String email);

    // Useful for admin — find user by email
    Optional<User> findByEmail(String email);
}
