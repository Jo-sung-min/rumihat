package com.rumihat.shop.cart;

import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    @PostMapping
    public Map<String, String> createCart() {
        return Map.of("cartId", UUID.randomUUID().toString());
    }
}

