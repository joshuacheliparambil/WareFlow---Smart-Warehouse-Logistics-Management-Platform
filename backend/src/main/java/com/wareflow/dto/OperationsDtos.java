package com.wareflow.dto;

import com.wareflow.domain.Enums.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class OperationsDtos {
  private OperationsDtos() {}
  public record ProductDto(Long id, String sku, String name, String category, int stock, int reorderPoint, int damagedUnits, String warehouse) {}
  public record StockUpdateRequest(@Min(1) int quantity, @NotBlank String reason, @NotNull InventoryDirection direction) {}
  public record OrderLine(@NotBlank String sku, @Min(1) int quantity, @DecimalMin("0.01") BigDecimal unitPrice) {}
  public record CreateOrderRequest(@NotBlank String region, @NotEmpty List<OrderLine> items) {}
  public record OrderSummary(Long id, String orderNumber, OrderStatus status, String region, BigDecimal totalAmount, Instant createdAt) {}
  public record DeliverySummary(Long id, String orderNumber, String agentName, DeliveryStatus status, Instant eta, boolean delayed) {}
  public record DashboardMetrics(long totalOrders, BigDecimal revenue, long lowStockProducts, long delayedDeliveries, double returnRate, double fulfillmentSuccessRate, double warehouseUtilization) {}
  public record RiskAlertDto(Long id, String title, RiskSeverity severity, int score, String reason, String recommendedAction, String entityType, String entityRef, Instant createdAt) {}
  public record EventDto(EventType type, String aggregateId, String message, Instant occurredAt) {}
}
