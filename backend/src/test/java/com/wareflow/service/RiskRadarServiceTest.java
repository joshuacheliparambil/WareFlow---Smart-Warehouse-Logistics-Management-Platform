package com.wareflow.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.wareflow.entity.*;
import com.wareflow.event.DomainEventPublisher;
import com.wareflow.repository.*;
import java.util.List;
import org.junit.jupiter.api.Test;

class RiskRadarServiceTest {
  @Test
  void refreshCreatesStockoutRiskForLowInventoryProduct() {
    ProductRepository products = mock(ProductRepository.class);
    WarehouseRepository warehouses = mock(WarehouseRepository.class);
    DeliveryAgentRepository agents = mock(DeliveryAgentRepository.class);
    RiskAlertRepository alerts = mock(RiskAlertRepository.class);
    DomainEventPublisher events = mock(DomainEventPublisher.class);
    Warehouse wh = new Warehouse();
    wh.setName("North Hub");
    wh.setCapacityUnits(100);
    wh.setUsedUnits(70);
    Product product = new Product();
    product.setName("iPhone 15");
    product.setSku("IPH-15");
    product.setStock(10);
    product.setReorderPoint(50);
    product.setWarehouse(wh);
    when(products.findAll()).thenReturn(List.of(product));
    when(warehouses.findAll()).thenReturn(List.of(wh));
    when(agents.findAll()).thenReturn(List.of());
    when(alerts.saveAll(anyList())).thenAnswer(invocation -> invocation.getArgument(0));

    RiskRadarService service = new RiskRadarService(products, warehouses, agents, alerts, events);

    var risks = service.refresh();

    assertThat(risks).hasSize(1);
    assertThat(risks.get(0).title()).contains("stock out");
    assertThat(risks.get(0).score()).isGreaterThanOrEqualTo(80);
  }
}
