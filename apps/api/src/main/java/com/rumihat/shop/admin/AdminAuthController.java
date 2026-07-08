package com.rumihat.shop.admin;

import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {
    private final String adminEmail;
    private final String adminPassword;

    public AdminAuthController(
        @Value("${app.admin.email}") String adminEmail,
        @Value("${app.admin.password}") String adminPassword
    ) {
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AdminLoginRequest request) {
        if (!adminEmail.equals(request.email()) || !adminPassword.equals(request.password())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
        }

        return ResponseEntity.ok(Map.of("token", UUID.randomUUID().toString()));
    }
}
