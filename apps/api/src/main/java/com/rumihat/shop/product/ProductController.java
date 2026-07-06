package com.rumihat.shop.product;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product create(@RequestBody ProductCreateRequest request) {
        Product product = new Product(
            request.slug(),
            request.name(),
            request.summary(),
            request.price(),
            request.salePrice(),
            request.badge(),
            request.colorName(),
            request.tone(),
            request.accent(),
            request.imageUrl(),
            request.visible() == null || request.visible(),
            request.material(),
            request.care()
        );

        return productRepository.save(product);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Product> findBySlug(@PathVariable String slug) {
        return productRepository.findBySlug(slug)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
