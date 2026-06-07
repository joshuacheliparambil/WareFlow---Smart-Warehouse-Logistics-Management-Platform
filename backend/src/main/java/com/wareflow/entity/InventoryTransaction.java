package com.wareflow.entity;

import com.wareflow.domain.Enums.InventoryDirection;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "inventory_transactions", indexes = {
  @Index(name = "idx_inventory_created", columnList = "createdAt"),
  @Index(name = "idx_inventory_product", columnList = "product_id")
})
public class InventoryTransaction {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false)
  private Product product;
  @Enumerated(EnumType.STRING)
  private InventoryDirection direction;
  private int quantity;
  private String reason;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public Product getProduct() { return product; }
  public void setProduct(Product product) { this.product = product; }
  public InventoryDirection getDirection() { return direction; }
  public void setDirection(InventoryDirection direction) { this.direction = direction; }
  public int getQuantity() { return quantity; }
  public void setQuantity(int quantity) { this.quantity = quantity; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
