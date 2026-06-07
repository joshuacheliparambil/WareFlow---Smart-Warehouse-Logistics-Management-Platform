package com.wareflow.service;

import com.wareflow.domain.Enums.*;
import com.wareflow.dto.OperationsDtos.DashboardMetrics;
import com.wareflow.repository.*;
import java.math.BigDecimal;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
  private final CustomerOrderRepository orders;
  private final ProductRepository products;
  private final DeliveryRepository deliveries;
  private final WarehouseRepository warehouses;
  private final ReturnRequestRepository returns;

  public DashboardService(CustomerOrderRepository orders, ProductRepository products, DeliveryRepository deliveries, WarehouseRepository warehouses, ReturnRequestRepository returns) {
    this.orders = orders;
    this.products = products;
    this.deliveries = deliveries;
    this.warehouses = warehouses;
    this.returns = returns;
  }

  @Cacheable("dashboard")
  public DashboardMetrics metrics() {
    var allOrders = orders.findAll();
    BigDecimal revenue = allOrders.stream().map(o -> o.getTotalAmount()).reduce(BigDecimal.ZERO, BigDecimal::add);
    long delayed = deliveries.findAll().stream().filter(d -> d.isDelayed() || d.getStatus() == DeliveryStatus.DELAYED).count();
    double utilization = warehouses.findAll().stream().mapToDouble(w -> w.getUsedUnits() * 100.0 / Math.max(w.getCapacityUnits(), 1)).average().orElse(0);
    double returnRate = allOrders.isEmpty() ? 0 : returns.count() * 100.0 / allOrders.size();
    long fulfilled = allOrders.stream().filter(o -> o.getStatus() != OrderStatus.FAILED_FULFILLMENT && o.getStatus() != OrderStatus.CANCELLED).count();
    double success = allOrders.isEmpty() ? 0 : fulfilled * 100.0 / allOrders.size();
    return new DashboardMetrics(allOrders.size(), revenue, products.findByStockLessThanEqual(50).size(), delayed, returnRate, success, utilization);
  }
}
