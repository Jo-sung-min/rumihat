package com.rumihat.shop.cart;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    private final Map<String, List<CartItemResponse>> carts = new ConcurrentHashMap<>();

    @PostMapping
    public CartResponse createCart() {
        String cartId = UUID.randomUUID().toString();
        carts.put(cartId, new ArrayList<>());
        return new CartResponse(cartId, List.of());
    }

    @GetMapping("/{cartId}")
    public ResponseEntity<CartResponse> findCart(@PathVariable String cartId) {
        List<CartItemResponse> items = carts.get(cartId);

        if (items == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new CartResponse(cartId, items));
    }

    @PostMapping("/{cartId}/items")
    public ResponseEntity<CartResponse> addItem(@PathVariable String cartId, @RequestBody CartItemRequest request) {
        List<CartItemResponse> items = carts.computeIfAbsent(cartId, ignored -> new ArrayList<>());
        String itemId = request.productSlug() + ":" + request.optionLabel();
        CartItemResponse nextItem = new CartItemResponse(
            itemId,
            request.productSlug(),
            request.productName(),
            request.optionLabel(),
            request.unitPrice(),
            Math.max(1, request.quantity())
        );
        boolean exists = false;

        for (int index = 0; index < items.size(); index += 1) {
            CartItemResponse item = items.get(index);

            if (item.id().equals(itemId)) {
                items.set(index, new CartItemResponse(
                    item.id(),
                    item.productSlug(),
                    item.productName(),
                    item.optionLabel(),
                    item.unitPrice(),
                    item.quantity() + nextItem.quantity()
                ));
                exists = true;
                break;
            }
        }

        if (!exists) {
            items.add(nextItem);
        }

        return ResponseEntity.ok(new CartResponse(cartId, items));
    }

    @PutMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<CartResponse> updateQuantity(
        @PathVariable String cartId,
        @PathVariable String itemId,
        @RequestBody CartQuantityRequest request
    ) {
        List<CartItemResponse> items = carts.get(cartId);

        if (items == null) {
            return ResponseEntity.notFound().build();
        }

        List<CartItemResponse> nextItems = items.stream()
            .map(item -> item.id().equals(itemId)
                ? new CartItemResponse(item.id(), item.productSlug(), item.productName(), item.optionLabel(), item.unitPrice(), Math.max(1, request.quantity()))
                : item)
            .toList();
        carts.put(cartId, new ArrayList<>(nextItems));
        return ResponseEntity.ok(new CartResponse(cartId, nextItems));
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable String cartId, @PathVariable String itemId) {
        List<CartItemResponse> items = carts.get(cartId);

        if (items == null) {
            return ResponseEntity.notFound().build();
        }

        List<CartItemResponse> nextItems = items.stream().filter(item -> !item.id().equals(itemId)).toList();
        carts.put(cartId, new ArrayList<>(nextItems));
        return ResponseEntity.ok(new CartResponse(cartId, nextItems));
    }

    public record CartItemRequest(String productSlug, String productName, String optionLabel, int unitPrice, int quantity) {
    }

    public record CartQuantityRequest(int quantity) {
    }

    public record CartItemResponse(String id, String productSlug, String productName, String optionLabel, int unitPrice, int quantity) {
    }

    public record CartResponse(String cartId, List<CartItemResponse> items) {
    }
}
