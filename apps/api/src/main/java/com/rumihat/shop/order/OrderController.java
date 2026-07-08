package com.rumihat.shop.order;

import java.time.Instant;
import java.util.List;
import com.rumihat.shop.product.Product;
import com.rumihat.shop.product.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderController(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderCreateRequest request) {
        List<OrderItemRequest> items = request.items() == null ? List.of() : request.items();
        int subtotal = items.stream()
            .mapToInt(item -> item.unitPrice() * item.quantity())
            .sum();
        int shippingFee = subtotal >= 80000 ? 0 : 3000;
        String orderNumber = "RUM-" + Instant.now().toEpochMilli();
        List<OrderItem> orderItems;

        try {
            orderItems = items.stream()
                .map(item -> {
                    Product product = productRepository.findBySlug(item.productSlug())
                        .orElseThrow(() -> new IllegalArgumentException("Unknown product slug: " + item.productSlug()));
                    return new OrderItem(
                        product,
                        item.productName() == null || item.productName().isBlank() ? product.getName() : item.productName(),
                        item.optionLabel() == null || item.optionLabel().isBlank() ? "Default / FREE" : item.optionLabel(),
                        item.unitPrice(),
                        Math.max(1, item.quantity())
                    );
                })
                .toList();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().build();
        }

        Order savedOrder = orderRepository.save(new Order(
            orderNumber,
            request.buyerName(),
            request.buyerEmail(),
            request.receiverPhone(),
            request.shippingAddress(),
            subtotal + shippingFee,
            orderItems
        ));

        return ResponseEntity.ok(new OrderResponse(
            savedOrder.getOrderNumber(),
            savedOrder.getStatus(),
            subtotal,
            shippingFee,
            subtotal + shippingFee
        ));
    }

    @GetMapping("/me")
    public List<OrderSummaryResponse> findMyOrders(@RequestHeader("X-Customer-Email") String customerEmail) {
        return orderRepository.findByCustomerEmailOrderByCreatedAtDesc(customerEmail).stream()
            .map(this::toSummary)
            .toList();
    }

    @GetMapping("/admin")
    public List<AdminOrderResponse> findAdminOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(order -> new AdminOrderResponse(
                order.getOrderNumber(),
                order.getStatus(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getReceiverPhone(),
                order.getShippingAddress(),
                order.getTotalPrice(),
                order.getCreatedAt().toString(),
                order.getItems().stream()
                    .map(item -> new AdminOrderItemResponse(item.getProductName(), item.getOptionName(), item.getUnitPrice(), item.getQuantity()))
                    .toList()
            ))
            .toList();
    }

    @PatchMapping("/admin/{orderNumber}/status")
    @Transactional
    public ResponseEntity<OrderSummaryResponse> updateOrderStatus(
        @PathVariable String orderNumber,
        @RequestBody OrderStatusUpdateRequest request
    ) {
        return orderRepository.findByOrderNumber(orderNumber)
            .map(order -> {
                order.updateStatus(request.status());
                return ResponseEntity.ok(toSummary(order));
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private OrderSummaryResponse toSummary(Order order) {
        return new OrderSummaryResponse(
            order.getOrderNumber(),
            order.getStatus(),
            order.getTotalPrice(),
            order.getCreatedAt().toString()
        );
    }

    public record OrderCreateRequest(
        String buyerName,
        String buyerEmail,
        String receiverPhone,
        String shippingAddress,
        List<OrderItemRequest> items
    ) {
    }

    public record OrderItemRequest(String productSlug, String productName, String optionLabel, int unitPrice, int quantity) {
    }

    public record OrderResponse(String orderNumber, String status, int subtotalAmount, int shippingFee, int totalAmount) {
    }

    public record OrderSummaryResponse(String orderNumber, String status, int totalAmount, String createdAt) {
    }

    public record OrderStatusUpdateRequest(String status) {
    }

    public record AdminOrderItemResponse(String productName, String optionName, int unitPrice, int quantity) {
    }

    public record AdminOrderResponse(
        String orderNumber,
        String status,
        String customerName,
        String customerEmail,
        String receiverPhone,
        String shippingAddress,
        int totalAmount,
        String createdAt,
        List<AdminOrderItemResponse> items
    ) {
    }
}
