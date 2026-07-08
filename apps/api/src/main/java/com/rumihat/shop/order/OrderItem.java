package com.rumihat.shop.order;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.rumihat.shop.product.Product;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private String productName;
    private String optionName;
    private int unitPrice;
    private int quantity;

    protected OrderItem() {
    }

    public OrderItem(Product product, String productName, String optionName, int unitPrice, int quantity) {
        this.product = product;
        this.productName = productName;
        this.optionName = optionName;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
    }

    void attachTo(Order order) {
        this.order = order;
    }

    public Long getId() {
        return id;
    }

    public String getProductName() {
        return productName;
    }

    public String getOptionName() {
        return optionName;
    }

    public int getUnitPrice() {
        return unitPrice;
    }

    public int getQuantity() {
        return quantity;
    }
}
