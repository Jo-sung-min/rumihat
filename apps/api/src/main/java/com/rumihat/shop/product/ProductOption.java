package com.rumihat.shop.product;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_options")
public class ProductOption {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String colorName;
    private String sizeName;
    private int stockQuantity;
    private int extraPrice;
    @Column(name = "option_name")
    private String optionName;
    @Column(name = "stock")
    private int stock;
    @Column(name = "additional_price")
    private int additionalPrice;

    protected ProductOption() {
    }

    public ProductOption(String colorName, String sizeName, int stockQuantity, int extraPrice) {
        this.colorName = colorName;
        this.sizeName = sizeName;
        this.stockQuantity = stockQuantity;
        this.extraPrice = extraPrice;
        this.optionName = String.join(" / ", colorName == null || colorName.isBlank() ? "Default" : colorName, sizeName == null || sizeName.isBlank() ? "FREE" : sizeName);
        this.stock = stockQuantity;
        this.additionalPrice = extraPrice;
    }

    void attachTo(Product product) {
        this.product = product;
    }

    public Long getId() {
        return id;
    }

    public String getColorName() {
        return colorName;
    }

    public String getSizeName() {
        return sizeName;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public int getExtraPrice() {
        return extraPrice;
    }
}
