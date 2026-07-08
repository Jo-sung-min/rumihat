package com.rumihat.shop.order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNumber;
    private String customerName;
    private String customerEmail;
    private String receiverPhone;
    private String shippingAddress;
    private int totalPrice;
    private String status = "PENDING";
    private String paymentMethod = "MANUAL";
    private String paymentStatus = "PENDING_PAYMENT";
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    protected Order() {
    }

    public Order(String orderNumber, String customerName, String customerEmail, String receiverPhone, String shippingAddress, int totalPrice, String paymentMethod, List<OrderItem> items) {
        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.receiverPhone = receiverPhone;
        this.shippingAddress = shippingAddress;
        this.totalPrice = totalPrice;
        this.paymentMethod = paymentMethod == null || paymentMethod.isBlank() ? "MANUAL" : paymentMethod;
        replaceItems(items);
    }

    private void replaceItems(List<OrderItem> nextItems) {
        items.clear();

        if (nextItems == null) {
            return;
        }

        nextItems.forEach(item -> {
            item.attachTo(this);
            items.add(item);
        });
    }

    public void updateStatus(String nextStatus) {
        if (nextStatus == null || nextStatus.isBlank()) {
            return;
        }

        this.status = nextStatus;
    }

    public Long getId() {
        return id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public int getTotalPrice() {
        return totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public String getPaymentMethod() {
        return paymentMethod == null || paymentMethod.isBlank() ? "MANUAL" : paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus == null || paymentStatus.isBlank() ? "PENDING_PAYMENT" : paymentStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }
}
