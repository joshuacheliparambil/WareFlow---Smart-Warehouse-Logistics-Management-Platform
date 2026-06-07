package com.wareflow.service;

import com.wareflow.domain.Enums.*;
import com.wareflow.dto.OperationsDtos.*;
import com.wareflow.entity.*;
import com.wareflow.event.DomainEventPublisher;
import com.wareflow.exception.ApiException;
import com.wareflow.repository.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
  private final CustomerOrderRepository orders;
  private final ProductRepository products;
  private final DomainEventPublisher events;

  public OrderService(CustomerOrderRepository orders, ProductRepository products, DomainEventPublisher events) {
    this.orders = orders;
    this.products = products;
    this.events = events;
  }

  public List<OrderSummary> listOrders() {
    return orders.findAll().stream().map(this::summary).toList();
  }

  @Transactional
  @CacheEvict(value = {"products", "dashboard"}, allEntries = true)
  public OrderSummary create(CreateOrderRequest request) {
    CustomerOrder order = new CustomerOrder();
    order.setOrderNumber("WF-" + Instant.now().toEpochMilli());
    order.setRegion(request.region());
    BigDecimal total = BigDecimal.ZERO;
    for (OrderLine line : request.items()) {
      Product product = products.findBySku(line.sku()).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found: " + line.sku()));
      if (product.getStock() < line.quantity()) {
        order.setStatus(OrderStatus.FAILED_FULFILLMENT);
        order.setFailedFulfillmentReason("Insufficient inventory for " + line.sku());
        break;
      }
      product.setStock(product.getStock() - line.quantity());
      OrderItem item = new OrderItem();
      item.setOrder(order);
      item.setProduct(product);
      item.setQuantity(line.quantity());
      item.setUnitPrice(line.unitPrice());
      order.getItems().add(item);
      total = total.add(line.unitPrice().multiply(BigDecimal.valueOf(line.quantity())));
    }
    order.setTotalAmount(total);
    CustomerOrder saved = orders.save(order);
    events.publish(new EventDto(EventType.ORDER_CREATED, saved.getOrderNumber(), "Order created in " + saved.getRegion(), Instant.now()));
    return summary(saved);
  }

  @Transactional
  public OrderSummary cancel(Long id) {
    CustomerOrder order = orders.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
    order.setStatus(OrderStatus.CANCELLED);
    events.publish(new EventDto(EventType.ORDER_CANCELLED, order.getOrderNumber(), "Order cancelled", Instant.now()));
    return summary(order);
  }

  private OrderSummary summary(CustomerOrder order) {
    return new OrderSummary(order.getId(), order.getOrderNumber(), order.getStatus(), order.getRegion(), order.getTotalAmount(), order.getCreatedAt());
  }
}
