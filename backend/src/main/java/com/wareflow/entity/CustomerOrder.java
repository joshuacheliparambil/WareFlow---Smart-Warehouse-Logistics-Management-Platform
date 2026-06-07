package com.wareflow.entity;

import com.wareflow.domain.Enums.OrderStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders", indexes = {
  @Index(name = "idx_order_status", columnList = "status"),
  @Index(name = "idx_order_created", columnList = "createdAt")
})
public class CustomerOrder {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false, unique = true)
  private String orderNumber;
  @Enumerated(EnumType.STRING)
  private OrderStatus status = OrderStatus.CREATED;
  private String region;
  private String failedFulfillmentReason;
  private BigDecimal totalAmount = BigDecimal.ZERO;
  private Instant createdAt = Instant.now();
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderItem> items = new ArrayList<>();

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getOrderNumber() { return orderNumber; }
  public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
  public OrderStatus getStatus() { return status; }
  public void setStatus(OrderStatus status) { this.status = status; }
  public String getRegion() { return region; }
  public void setRegion(String region) { this.region = region; }
  public String getFailedFulfillmentReason() { return failedFulfillmentReason; }
  public void setFailedFulfillmentReason(String failedFulfillmentReason) { this.failedFulfillmentReason = failedFulfillmentReason; }
  public BigDecimal getTotalAmount() { return totalAmount; }
  public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public List<OrderItem> getItems() { return items; }
  public void setItems(List<OrderItem> items) { this.items = items; }
}
