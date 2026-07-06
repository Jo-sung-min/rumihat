package com.rumihat.shop.product;

public record ProductCreateRequest(
    String slug,
    String name,
    String summary,
    int price,
    Integer salePrice,
    String badge,
    String colorName,
    String tone,
    String accent,
    String imageUrl,
    Boolean visible,
    String material,
    String care
) {
}
