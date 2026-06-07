package com.wareflow.entity;

import com.wareflow.domain.Enums.DeliveryStatus;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "deliveries", indexes = {
  @Index(name = "idx_delivery_status", columnList = "status"),
  @Index(name = "idx_delivery_eta", columnList = "eta")
})
public class Delivery {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @OneToOne(optional = false)
  private CustomerOrder order;
  @ManyToOne(optional = false)
  private DeliveryAgent agent;
  @Enumerated(EnumType.STRING)
  private DeliveryStatus status = DeliveryStatus.ASSIGNED;
  private Instant eta;
  private boolean delayed;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public CustomerOrder getOrder() { return order; }
  public void setOrder(CustomerOrder order) { this.order = order; }
  public DeliveryAgent getAgent() { return agent; }
  public void setAgent(DeliveryAgent agent) { this.agent = agent; }
  public DeliveryStatus getStatus() { return status; }
  public void setStatus(DeliveryStatus status) { this.status = status; }
  public Instant getEta() { return eta; }
  public void setEta(Instant eta) { this.eta = eta; }
  public boolean isDelayed() { return delayed; }
  public void setDelayed(boolean delayed) { this.delayed = delayed; }
}
