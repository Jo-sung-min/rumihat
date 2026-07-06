package com.rumihat.shop.order;

import java.time.Instant;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @PostMapping
    public Map<String, String> createOrder() {
        return Map.of(
            "orderNumber", "DRM-" + Instant.now().toEpochMilli(),
            "status", "PENDING"
        );
    }
}

