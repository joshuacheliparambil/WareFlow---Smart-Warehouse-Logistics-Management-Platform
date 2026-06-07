package com.wareflow.service;

import com.wareflow.domain.Enums.EventType;
import com.wareflow.dto.OperationsDtos.*;
import com.wareflow.entity.*;
import com.wareflow.event.DomainEventPublisher;
import com.wareflow.exception.ApiException;
import com.wareflow.repository.*;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeliveryService {
  private final DeliveryRepository deliveries;
  private final CustomerOrderRepository orders;
  private final DeliveryAgentRepository agents;
  private final DomainEventPublisher events;

  public DeliveryService(DeliveryRepository deliveries, CustomerOrderRepository orders, DeliveryAgentRepository agents, DomainEventPublisher events) {
    this.deliveries = deliveries;
    this.orders = orders;
    this.agents = agents;
    this.events = events;
  }

  public List<DeliverySummary> listDeliveries() {
    return deliveries.findAll().stream().map(this::summary).toList();
  }

  @Transactional
  public DeliverySummary assign(Long orderId, Long agentId) {
    CustomerOrder order = orders.findById(orderId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
    DeliveryAgent agent = agents.findById(agentId).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Agent not found"));
    Delivery delivery = new Delivery();
    delivery.setOrder(order);
    delivery.setAgent(agent);
    delivery.setEta(Instant.now().plusSeconds(3600 * 20));
    agent.setActiveDeliveries(agent.getActiveDeliveries() + 1);
    Delivery saved = deliveries.save(delivery);
    events.publish(new EventDto(EventType.DELIVERY_ASSIGNED, order.getOrderNumber(), "Delivery assigned to " + agent.getName(), Instant.now()));
    return summary(saved);
  }

  private DeliverySummary summary(Delivery delivery) {
    return new DeliverySummary(delivery.getId(), delivery.getOrder().getOrderNumber(), delivery.getAgent().getName(), delivery.getStatus(), delivery.getEta(), delivery.isDelayed());
  }
}
