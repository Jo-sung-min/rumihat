package com.rumihat.shop.product;

import java.util.List;
import java.util.ArrayList;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return productRepository.findAllByOrderByDisplayOrderAscIdDesc().stream()
            .map(this::toResponse)
            .toList();
    }

    @PostMapping
    @Transactional
    public ProductResponse create(@RequestBody ProductCreateRequest request) {
        Product product = toProduct(request);

        return toResponse(productRepository.save(product));
    }

    @PutMapping("/{slug}")
    @Transactional
    public ProductResponse upsert(@PathVariable String slug, @RequestBody ProductCreateRequest request) {
        Product product = productRepository.findBySlug(slug)
            .map(existingProduct -> {
                existingProduct.update(
                    slug,
                    request.name(),
                    request.category(),
                    request.summary(),
                    request.price(),
                    request.salePrice(),
                    request.badge(),
                    request.colorName(),
                    request.tone(),
                    request.accent(),
                    request.imageUrl(),
                    request.detailTitle(),
                    request.detailDescription(),
                    request.detailImages(),
                    request.visible() == null || request.visible(),
                    request.status(),
                    request.displayOrder() == null ? 0 : request.displayOrder(),
                    request.material(),
                    request.care(),
                    toImages(request),
                    toOptions(request)
                );
                return existingProduct;
            })
            .orElseGet(() -> productRepository.save(toProduct(request.withSlug(slug))));

        return toResponse(product);
    }

    @GetMapping("/{slug}")
    @Transactional(readOnly = true)
    public ResponseEntity<ProductResponse> findBySlug(@PathVariable String slug) {
        return productRepository.findBySlug(slug)
            .map(product -> ResponseEntity.ok(toResponse(product)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{slug}")
    @Transactional
    public ResponseEntity<Void> deleteBySlug(@PathVariable String slug) {
        productRepository.findBySlug(slug).ifPresent(Product::hide);
        return ResponseEntity.noContent().build();
    }

    private Product toProduct(ProductCreateRequest request) {
        return new Product(
            request.slug(),
            request.name(),
            request.category(),
            request.summary(),
            request.price(),
            request.salePrice(),
            request.badge(),
            request.colorName(),
            request.tone(),
            request.accent(),
            request.imageUrl(),
            request.detailTitle(),
            request.detailDescription(),
            request.detailImages(),
            request.visible() == null || request.visible(),
            request.status(),
            request.displayOrder() == null ? 0 : request.displayOrder(),
            request.material(),
            request.care(),
            toImages(request),
            toOptions(request)
        );
    }

    private List<ProductImage> toImages(ProductCreateRequest request) {
        List<ProductImage> images = new ArrayList<>();
        boolean hasPrimaryImage = request.images() != null && request.images().stream()
            .anyMatch(image -> "primary".equals(image.imageType()) && image.url() != null && !image.url().isBlank());

        if (!hasPrimaryImage && request.imageUrl() != null && !request.imageUrl().isBlank()) {
            images.add(new ProductImage(request.imageUrl(), request.name(), "primary", 0));
        }

        if (request.images() != null) {
            request.images().stream()
                .filter(image -> image.url() != null && !image.url().isBlank())
                .forEach(image -> images.add(new ProductImage(
                    image.url(),
                    image.alt() == null || image.alt().isBlank() ? request.name() : image.alt(),
                    image.imageType() == null || image.imageType().isBlank() ? "detail" : image.imageType(),
                    image.sortOrder() == null ? images.size() : image.sortOrder()
                )));
        } else if (request.detailImages() != null) {
            for (int index = 0; index < request.detailImages().size(); index += 1) {
                String imageUrl = request.detailImages().get(index);

                if (imageUrl != null && !imageUrl.isBlank()) {
                    images.add(new ProductImage(imageUrl, request.name(), "detail", index + 1));
                }
            }
        }

        return images;
    }

    private List<ProductOption> toOptions(ProductCreateRequest request) {
        if (request.options() == null || request.options().isEmpty()) {
            return List.of(new ProductOption(request.colorName(), "FREE", 0, 0));
        }

        return request.options().stream()
            .map(option -> new ProductOption(
                option.colorName() == null || option.colorName().isBlank() ? request.colorName() : option.colorName(),
                option.sizeName() == null || option.sizeName().isBlank() ? "FREE" : option.sizeName(),
                option.stockQuantity() == null ? 0 : option.stockQuantity(),
                option.extraPrice() == null ? 0 : option.extraPrice()
            ))
            .toList();
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
            product.getSlug(),
            product.getName(),
            product.getCategory(),
            product.getSummary(),
            product.getPrice(),
            product.getSalePrice(),
            product.getBadge(),
            product.getColorName(),
            product.getTone(),
            product.getAccent(),
            product.getImageUrl(),
            product.getDetailTitle(),
            product.getDetailDescription(),
            product.getDetailImages(),
            product.isVisible(),
            product.getStatus(),
            product.getDisplayOrder(),
            product.getMaterial(),
            product.getCare(),
            product.getImages().stream()
                .map(image -> new ProductImageResponse(image.getUrl(), image.getAlt(), image.getImageType(), image.getSortOrder()))
                .toList(),
            product.getOptions().stream()
                .map(option -> new ProductOptionResponse(option.getColorName(), option.getSizeName(), option.getStockQuantity(), option.getExtraPrice()))
                .toList()
        );
    }

    public record ProductImageResponse(String url, String alt, String imageType, int sortOrder) {
    }

    public record ProductOptionResponse(String colorName, String sizeName, int stockQuantity, int extraPrice) {
    }

    public record ProductResponse(
        String slug,
        String name,
        String category,
        String summary,
        int price,
        Integer salePrice,
        String badge,
        String colorName,
        String tone,
        String accent,
        String imageUrl,
        String detailTitle,
        String detailDescription,
        List<String> detailImages,
        boolean visible,
        ProductStatus status,
        int displayOrder,
        String material,
        String care,
        List<ProductImageResponse> images,
        List<ProductOptionResponse> options
    ) {
    }
}
