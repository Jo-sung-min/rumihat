package com.rumihat.shop.product;

import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByDisplayOrderAscIdDesc();
    Optional<Product> findBySlug(String slug);
    void deleteBySlug(String slug);
}
