package com.rumihat.shop.admin;

import java.util.Map;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {
    private static final String ADMIN_EMAIL = "admin@rumihat.local";
    private static final String ADMIN_PASSWORD = "admin1234";

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AdminLoginRequest request) {
        if (!ADMIN_EMAIL.equals(request.email()) || !ADMIN_PASSWORD.equals(request.password())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        return ResponseEntity.ok(Map.of("token", UUID.randomUUID().toString()));
    }
}

