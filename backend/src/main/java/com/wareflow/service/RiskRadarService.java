package com.wareflow.service;

import com.wareflow.domain.Enums.*;
import com.wareflow.dto.OperationsDtos.*;
import com.wareflow.entity.*;
import com.wareflow.event.DomainEventPublisher;
import com.wareflow.repository.*;
import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RiskRadarService {
  private final ProductRepository products;
  private final WarehouseRepository warehouses;
  private final DeliveryAgentRepository agents;
  private final RiskAlertRepository alerts;
  private final DomainEventPublisher events;

  public RiskRadarService(ProductRepository products, WarehouseRepository warehouses, DeliveryAgentRepository agents, RiskAlertRepository alerts, DomainEventPublisher events) {
    this.products = products;
    this.warehouses = warehouses;
    this.agents = agents;
    this.alerts = alerts;
    this.events = events;
  }

  public List<RiskAlertDto> activeRisks() {
    return alerts.findTop20ByResolvedFalseOrderByScoreDesc().stream().map(this::dto).toList();
  }

  @Transactional
  public List<RiskAlertDto> refresh() {
    List<RiskAlert> generated = new ArrayList<>();
    products.findAll().stream().filter(p -> p.getStock() <= p.getReorderPoint()).forEach(product -> generated.add(build(
      product.getName() + " may stock out soon",
      product.getStock() < product.getReorderPoint() / 2 ? RiskSeverity.HIGH : RiskSeverity.MEDIUM,
      product.getStock() < product.getReorderPoint() / 2 ? 88 : 66,
      "Current stock = " + product.getStock() + ", reorder point = " + product.getReorderPoint(),
      "Create purchase order for at least " + Math.max(product.getReorderPoint() * 3, 100) + " units",
      "PRODUCT",
      product.getSku(),
      product.getWarehouse())));

    warehouses.findAll().stream().filter(w -> utilization(w) > 85).forEach(w -> generated.add(build(
      w.getName() + " is nearing capacity",
      utilization(w) > 95 ? RiskSeverity.CRITICAL : RiskSeverity.HIGH,
      utilization(w),
      "Warehouse utilization is " + utilization(w) + "%",
      "Move slow stock to overflow warehouse and throttle inbound shipments",
      "WAREHOUSE",
      w.getName(),
      w)));

    agents.findAll().stream().filter(a -> a.getOnTimeRate() < 86).forEach(agent -> generated.add(build(
      agent.getName() + " has declining delivery performance",
      agent.getOnTimeRate() < 75 ? RiskSeverity.HIGH : RiskSeverity.MEDIUM,
      (int) (100 - agent.getOnTimeRate()),
      "On-time rate dropped to " + agent.getOnTimeRate() + "% with " + agent.getActiveDeliveries() + " active deliveries",
      "Rebalance route load and audit delayed route clusters",
      "DELIVERY_AGENT",
      agent.getName(),
      null)));

    List<RiskAlert> saved = alerts.saveAll(generated);
    saved.forEach(alert -> events.publish(new EventDto(EventType.RISK_DETECTED, alert.getEntityRef(), alert.getTitle(), Instant.now())));
    return saved.stream().map(this::dto).toList();
  }

  private int utilization(Warehouse w) {
    return (int) Math.round((w.getUsedUnits() * 100.0) / Math.max(w.getCapacityUnits(), 1));
  }

  private RiskAlert build(String title, RiskSeverity severity, int score, String reason, String action, String entityType, String entityRef, Warehouse warehouse) {
    RiskAlert alert = new RiskAlert();
    alert.setTitle(title);
    alert.setSeverity(severity);
    alert.setScore(Math.min(score, 100));
    alert.setReason(reason);
    alert.setRecommendedAction(action);
    alert.setEntityType(entityType);
    alert.setEntityRef(entityRef);
    alert.setWarehouse(warehouse);
    return alert;
  }

  private RiskAlertDto dto(RiskAlert alert) {
    return new RiskAlertDto(alert.getId(), alert.getTitle(), alert.getSeverity(), alert.getScore(), alert.getReason(), alert.getRecommendedAction(), alert.getEntityType(), alert.getEntityRef(), alert.getCreatedAt());
  }
}
