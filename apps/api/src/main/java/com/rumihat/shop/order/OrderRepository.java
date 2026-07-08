package com.rumihat.shop.order;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByOrderNumber(String orderNumber);
}
