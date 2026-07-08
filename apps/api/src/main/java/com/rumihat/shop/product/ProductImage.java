package com.rumihat.shop.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_images")
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String url;
    private String alt;
    private String imageType;
    private int sortOrder;

    protected ProductImage() {
    }

    public ProductImage(String url, String alt, String imageType, int sortOrder) {
        this.url = url;
        this.alt = alt;
        this.imageType = imageType;
        this.sortOrder = sortOrder;
    }

    void attachTo(Product product) {
        this.product = product;
    }

    public Long getId() {
        return id;
    }

    public String getUrl() {
        return url;
    }

    public String getAlt() {
        return alt;
    }

    public String getImageType() {
        return imageType;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
