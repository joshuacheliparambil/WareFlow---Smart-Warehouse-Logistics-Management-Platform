package com.wareflow.service;

import com.wareflow.domain.Enums.*;
import com.wareflow.dto.OperationsDtos.*;
import com.wareflow.entity.*;
import com.wareflow.event.DomainEventPublisher;
import com.wareflow.exception.ApiException;
import com.wareflow.repository.*;
import java.time.Instant;
import java.util.List;
import org.springframework.cache.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {
  private final ProductRepository products;
  private final InventoryTransactionRepository transactions;
  private final DomainEventPublisher events;

  public InventoryService(ProductRepository products, InventoryTransactionRepository transactions, DomainEventPublisher events) {
    this.products = products;
    this.transactions = transactions;
    this.events = events;
  }

  @Cacheable("products")
  public List<ProductDto> listProducts() {
    return products.findAll().stream().map(this::toDto).toList();
  }

  @Transactional
  @CacheEvict(value = {"products", "dashboard"}, allEntries = true)
  public ProductDto updateStock(String sku, StockUpdateRequest request) {
    Product product = products.findBySku(sku).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
    int delta = switch (request.direction()) {
      case INBOUND -> request.quantity();
      case OUTBOUND, DAMAGED -> -request.quantity();
      case ADJUSTMENT -> request.quantity();
    };
    if (product.getStock() + delta < 0) {
      throw new ApiException(HttpStatus.CONFLICT, "Insufficient stock for " + sku);
    }
    product.setStock(product.getStock() + delta);
    if (request.direction() == InventoryDirection.DAMAGED) {
      product.setDamagedUnits(product.getDamagedUnits() + request.quantity());
    }
    InventoryTransaction tx = new InventoryTransaction();
    tx.setProduct(product);
    tx.setDirection(request.direction());
    tx.setQuantity(request.quantity());
    tx.setReason(request.reason());
    transactions.save(tx);
    events.publish(new EventDto(EventType.INVENTORY_UPDATED, sku, "Inventory updated for " + sku, Instant.now()));
    if (product.getStock() <= product.getReorderPoint()) {
      events.publish(new EventDto(EventType.LOW_STOCK_TRIGGERED, sku, product.getName() + " is below reorder point", Instant.now()));
    }
    return toDto(product);
  }

  private ProductDto toDto(Product product) {
    return new ProductDto(product.getId(), product.getSku(), product.getName(), product.getCategory(), product.getStock(), product.getReorderPoint(), product.getDamagedUnits(), product.getWarehouse().getName());
  }
}
