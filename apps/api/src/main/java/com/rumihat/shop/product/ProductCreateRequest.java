package com.rumihat.shop.product;

public record ProductCreateRequest(
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
    java.util.List<String> detailImages,
    Boolean visible,
    ProductStatus status,
    Integer displayOrder,
    String material,
    String care,
    java.util.List<ProductImageRequest> images,
    java.util.List<ProductOptionRequest> options
) {
    public ProductCreateRequest withSlug(String nextSlug) {
        return new ProductCreateRequest(
            nextSlug,
            name,
            category,
            summary,
            price,
            salePrice,
            badge,
            colorName,
            tone,
            accent,
            imageUrl,
            detailTitle,
            detailDescription,
            detailImages,
            visible,
            status,
            displayOrder,
            material,
            care,
            images,
            options
        );
    }

    public record ProductImageRequest(String url, String alt, String imageType, Integer sortOrder) {
    }

    public record ProductOptionRequest(String colorName, String sizeName, Integer stockQuantity, Integer extraPrice) {
    }
}
