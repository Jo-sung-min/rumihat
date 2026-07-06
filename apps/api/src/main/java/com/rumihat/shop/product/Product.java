package com.rumihat.shop.product;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String slug;

    @NotBlank
    private String name;

    private String summary;

    @Positive
    private int price;

    private Integer salePrice;
    private String badge;
    private String colorName;
    private String tone;
    private String accent;
    private String imageUrl;
    private boolean visible = true;
    private String material;
    private String care;

    protected Product() {
    }

    public Product(String slug, String name, String summary, int price, Integer salePrice, String badge, String colorName, String tone, String accent, String imageUrl, boolean visible, String material, String care) {
        this.slug = slug;
        this.name = name;
        this.summary = summary;
        this.price = price;
        this.salePrice = salePrice;
        this.badge = badge;
        this.colorName = colorName;
        this.tone = tone;
        this.accent = accent;
        this.imageUrl = imageUrl;
        this.visible = visible;
        this.material = material;
        this.care = care;
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public String getSummary() {
        return summary;
    }

    public int getPrice() {
        return price;
    }

    public Integer getSalePrice() {
        return salePrice;
    }

    public String getBadge() {
        return badge;
    }

    public String getColorName() {
        return colorName;
    }

    public String getTone() {
        return tone;
    }

    public String getAccent() {
        return accent;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public boolean isVisible() {
        return visible;
    }

    public String getMaterial() {
        return material;
    }

    public String getCare() {
        return care;
    }
}
