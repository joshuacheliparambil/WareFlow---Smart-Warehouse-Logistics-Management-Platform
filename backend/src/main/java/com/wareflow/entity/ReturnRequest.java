package com.wareflow.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "return_requests", indexes = @Index(name = "idx_return_created", columnList = "createdAt"))
public class ReturnRequest {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @ManyToOne(optional = false)
  private CustomerOrder order;
  private String reason;
  private boolean approved;
  private Instant createdAt = Instant.now();

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public CustomerOrder getOrder() { return order; }
  public void setOrder(CustomerOrder order) { this.order = order; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
  public boolean isApproved() { return approved; }
  public void setApproved(boolean approved) { this.approved = approved; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
