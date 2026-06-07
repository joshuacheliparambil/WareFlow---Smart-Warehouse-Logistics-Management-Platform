package com.wareflow.entity;

import com.wareflow.domain.Enums.RiskSeverity;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "risk_alerts", indexes = {
  @Index(name = "idx_risk_severity", columnList = "severity"),
  @Index(name = "idx_risk_created", columnList = "createdAt")
})
public class RiskAlert {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private String title;
  @Enumerated(EnumType.STRING)
  private RiskSeverity severity;
  private int score;
  @Column(length = 1000)
  private String reason;
  @Column(length = 1000)
  private String recommendedAction;
  private String entityType;
  private String entityRef;
  @ManyToOne
  private Warehouse warehouse;
  private Instant createdAt = Instant.now();
  private boolean resolved;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }
  public RiskSeverity getSeverity() { return severity; }
  public void setSeverity(RiskSeverity severity) { this.severity = severity; }
  public int getScore() { return score; }
  public void setScore(int score) { this.score = score; }
  public String getReason() { return reason; }
  public void setReason(String reason) { this.reason = reason; }
  public String getRecommendedAction() { return recommendedAction; }
  public void setRecommendedAction(String recommendedAction) { this.recommendedAction = recommendedAction; }
  public String getEntityType() { return entityType; }
  public void setEntityType(String entityType) { this.entityType = entityType; }
  public String getEntityRef() { return entityRef; }
  public void setEntityRef(String entityRef) { this.entityRef = entityRef; }
  public Warehouse getWarehouse() { return warehouse; }
  public void setWarehouse(Warehouse warehouse) { this.warehouse = warehouse; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
  public boolean isResolved() { return resolved; }
  public void setResolved(boolean resolved) { this.resolved = resolved; }
}
