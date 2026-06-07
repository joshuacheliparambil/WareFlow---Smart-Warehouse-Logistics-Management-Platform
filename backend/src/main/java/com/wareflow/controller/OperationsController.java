package com.wareflow.controller;

import com.wareflow.dto.OperationsDtos.*;
import com.wareflow.service.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class OperationsController {
  private final InventoryService inventory;
  private final OrderService orders;
  private final DeliveryService deliveries;
  private final DashboardService dashboard;
  private final RiskRadarService riskRadar;

  public OperationsController(InventoryService inventory, OrderService orders, DeliveryService deliveries, DashboardService dashboard, RiskRadarService riskRadar) {
    this.inventory = inventory;
    this.orders = orders;
    this.deliveries = deliveries;
    this.dashboard = dashboard;
    this.riskRadar = riskRadar;
  }

  @GetMapping("/dashboard/metrics")
  DashboardMetrics metrics() { return dashboard.metrics(); }

  @GetMapping("/inventory/products")
  List<ProductDto> products() { return inventory.listProducts(); }

  @PatchMapping("/inventory/products/{sku}/stock")
  @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
  ProductDto updateStock(@PathVariable String sku, @Valid @RequestBody StockUpdateRequest request) { return inventory.updateStock(sku, request); }

  @GetMapping("/orders")
  List<OrderSummary> orders() { return orders.listOrders(); }

  @PostMapping("/orders")
  @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
  OrderSummary createOrder(@Valid @RequestBody CreateOrderRequest request) { return orders.create(request); }

  @PostMapping("/orders/{id}/cancel")
  @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
  OrderSummary cancelOrder(@PathVariable Long id) { return orders.cancel(id); }

  @GetMapping("/deliveries")
  List<DeliverySummary> deliveries() { return deliveries.listDeliveries(); }

  @PostMapping("/deliveries/assign")
  @PreAuthorize("hasAnyRole('ADMIN','WAREHOUSE_MANAGER')")
  DeliverySummary assign(@RequestParam Long orderId, @RequestParam Long agentId) { return deliveries.assign(orderId, agentId); }

  @GetMapping("/risk-radar")
  List<RiskAlertDto> risks() { return riskRadar.activeRisks(); }

  @PostMapping("/risk-radar/refresh")
  @PreAuthorize("hasAnyRole('ADMIN','ANALYST')")
  List<RiskAlertDto> refreshRisks() { return riskRadar.refresh(); }
}
