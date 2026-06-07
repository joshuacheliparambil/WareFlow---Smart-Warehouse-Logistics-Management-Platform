package com.wareflow.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "products", indexes = {
  @Index(name = "idx_product_sku", columnList = "sku", unique = true),
  @Index(name = "idx_product_warehouse", columnList = "warehouse_id")
})
public class Product {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String sku;
  @Column(nullable = false)
  private String name;
  @Column(nullable = false)
  private String category;
  @Column(nullable = false)
  private int stock;
  @Column(nullable = false)
  private int reorderPoint;
  @Column(nullable = false)
  private int damagedUnits;
  private String batchCode;
  private LocalDate expiryDate;
  @ManyToOne(optional = false)
  private Warehouse warehouse;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getSku() { return sku; }
  public void setSku(String sku) { this.sku = sku; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }
  public int getStock() { return stock; }
  public void setStock(int stock) { this.stock = stock; }
  public int getReorderPoint() { return reorderPoint; }
  public void setReorderPoint(int reorderPoint) { this.reorderPoint = reorderPoint; }
  public int getDamagedUnits() { return damagedUnits; }
  public void setDamagedUnits(int damagedUnits) { this.damagedUnits = damagedUnits; }
  public String getBatchCode() { return batchCode; }
  public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
  public LocalDate getExpiryDate() { return expiryDate; }
  public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
  public Warehouse getWarehouse() { return warehouse; }
  public void setWarehouse(Warehouse warehouse) { this.warehouse = warehouse; }
}
