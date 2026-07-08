package com.rumihat.shop.product;

import java.util.List;
import java.util.ArrayList;
import jakarta.persistence.Column;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

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

    private String category = "CAP";

    private String summary;

    @Positive
    private int price;

    private Integer salePrice;
    private String badge;
    private String colorName;
    private String tone;
    private String accent;
    private String imageUrl;
    private String detailTitle;
    private String detailDescription;
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(columnDefinition = "text[]")
    private List<String> detailImages;
    private boolean visible = true;
    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.ACTIVE;
    private int displayOrder;
    private String material;
    private String care;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductOption> options = new ArrayList<>();

    protected Product() {
    }

    public Product(String slug, String name, String category, String summary, int price, Integer salePrice, String badge, String colorName, String tone, String accent, String imageUrl, String detailTitle, String detailDescription, List<String> detailImages, boolean visible, ProductStatus status, int displayOrder, String material, String care, List<ProductImage> images, List<ProductOption> options) {
        update(slug, name, category, summary, price, salePrice, badge, colorName, tone, accent, imageUrl, detailTitle, detailDescription, detailImages, visible, status, displayOrder, material, care, images, options);
    }

    public void update(String slug, String name, String category, String summary, int price, Integer salePrice, String badge, String colorName, String tone, String accent, String imageUrl, String detailTitle, String detailDescription, List<String> detailImages, boolean visible, ProductStatus status, int displayOrder, String material, String care, List<ProductImage> images, List<ProductOption> options) {
        this.slug = slug;
        this.name = name;
        this.category = category == null || category.isBlank() ? "CAP" : category;
        this.summary = summary;
        this.price = price;
        this.salePrice = salePrice;
        this.badge = badge;
        this.colorName = colorName;
        this.tone = tone;
        this.accent = accent;
        this.imageUrl = imageUrl;
        this.detailTitle = detailTitle;
        this.detailDescription = detailDescription;
        this.detailImages = detailImages;
        this.visible = visible;
        this.status = status == null ? (visible ? ProductStatus.ACTIVE : ProductStatus.HIDDEN) : status;
        this.displayOrder = displayOrder;
        this.material = material;
        this.care = care;
        replaceImages(images);
        replaceOptions(options);
    }

    public void hide() {
        this.visible = false;
        this.status = ProductStatus.HIDDEN;
    }

    private void replaceImages(List<ProductImage> nextImages) {
        images.clear();

        if (nextImages == null) {
            return;
        }

        nextImages.forEach(image -> {
            image.attachTo(this);
            images.add(image);
        });
    }

    private void replaceOptions(List<ProductOption> nextOptions) {
        options.clear();

        if (nextOptions == null) {
            return;
        }

        nextOptions.forEach(option -> {
            option.attachTo(this);
            options.add(option);
        });
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

    public String getCategory() {
        return category;
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

    public String getDetailTitle() {
        return detailTitle;
    }

    public String getDetailDescription() {
        return detailDescription;
    }

    public List<String> getDetailImages() {
        return detailImages;
    }

    public boolean isVisible() {
        return visible;
    }

    public ProductStatus getStatus() {
        return status;
    }

    public int getDisplayOrder() {
        return displayOrder;
    }

    public String getMaterial() {
        return material;
    }

    public String getCare() {
        return care;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public List<ProductOption> getOptions() {
        return options;
    }
}
