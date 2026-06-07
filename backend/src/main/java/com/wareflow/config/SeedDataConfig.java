package com.wareflow.config;

import com.wareflow.domain.Enums.*;
import com.wareflow.entity.*;
import com.wareflow.repository.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SeedDataConfig {
  @Bean
  CommandLineRunner seed(
    @Value("${wareflow.seed.enabled:true}") boolean enabled,
    UserRepository users,
    RoleRepository roles,
    WarehouseRepository warehouses,
    ProductRepository products,
    InventoryTransactionRepository transactions,
    CustomerOrderRepository orders,
    DeliveryAgentRepository agents,
    DeliveryRepository deliveries,
    ReturnRequestRepository returns,
    RiskAlertRepository risks,
    PasswordEncoder encoder
  ) {
    return args -> {
      if (!enabled || users.count() > 0) return;
      Arrays.stream(RoleName.values()).forEach(roleName -> {
        Role role = new Role();
        role.setName(roleName);
        role.setDescription("Grants " + roleName.name().replace("_", " ").toLowerCase() + " permissions");
        roles.save(role);
      });
      users.save(user("admin@wareflow.dev", "Avery Admin", RoleName.ADMIN, encoder));
      users.save(user("manager@wareflow.dev", "Mira Manager", RoleName.WAREHOUSE_MANAGER, encoder));
      users.save(user("analyst@wareflow.dev", "Anika Analyst", RoleName.ANALYST, encoder));
      users.save(user("agent@wareflow.dev", "Dev Delivery", RoleName.DELIVERY_AGENT, encoder));

      List<String> regions = List.of("North", "South", "East", "West", "Central");
      List<Warehouse> whs = new ArrayList<>();
      for (int i = 0; i < 5; i++) {
        Warehouse w = new Warehouse();
        w.setName("WF-" + regions.get(i) + " Fulfillment Hub");
        w.setRegion(regions.get(i));
        w.setCapacityUnits(12000 + i * 1800);
        w.setUsedUnits(8000 + i * 1300);
        whs.add(warehouses.save(w));
      }

      List<Product> productList = new ArrayList<>();
      String[] categories = {"Phones", "Laptops", "Home", "Fashion", "Grocery", "Beauty"};
      for (int i = 1; i <= 100; i++) {
        Product p = new Product();
        p.setSku("WF-SKU-" + String.format("%04d", i));
        p.setName(sampleProduct(i));
        p.setCategory(categories[i % categories.length]);
        p.setStock(i % 11 == 0 ? 18 : 80 + i * 4);
        p.setReorderPoint(50);
        p.setDamagedUnits(i % 9);
        p.setBatchCode("BATCH-" + Year.now() + "-" + i);
        p.setExpiryDate(LocalDate.now().plusDays(120 + i));
        p.setWarehouse(whs.get(i % whs.size()));
        productList.add(products.save(p));
      }

      for (int i = 1; i <= 10000; i++) {
        Product product = productList.get(i % productList.size());
        InventoryTransaction tx = new InventoryTransaction();
        tx.setProduct(product);
        tx.setDirection(i % 5 == 0 ? InventoryDirection.OUTBOUND : InventoryDirection.INBOUND);
        tx.setQuantity(1 + (i % 28));
        tx.setReason(i % 5 == 0 ? "Customer fulfillment" : "Supplier inbound shipment");
        tx.setCreatedAt(Instant.now().minusSeconds(i * 180L));
        transactions.save(tx);
      }

      for (int i = 1; i <= 50; i++) {
        DeliveryAgent a = new DeliveryAgent();
        a.setName("Agent " + String.format("%02d", i));
        a.setRegion(regions.get(i % regions.size()));
        a.setOnTimeRate(i % 8 == 0 ? 72 : 90 + (i % 9));
        a.setAverageRating(3.8 + (i % 12) / 10.0);
        a.setActiveDeliveries(i % 6);
        agents.save(a);
      }

      for (int i = 1; i <= 2000; i++) {
        CustomerOrder order = new CustomerOrder();
        order.setOrderNumber("WF-SEED-" + String.format("%05d", i));
        order.setRegion(regions.get(i % regions.size()));
        order.setStatus(i % 17 == 0 ? OrderStatus.RETURNED : i % 13 == 0 ? OrderStatus.CANCELLED : OrderStatus.DELIVERED);
        order.setTotalAmount(BigDecimal.valueOf(1200 + (i * 37L)));
        order.setCreatedAt(Instant.now().minusSeconds(i * 7200L));
        orders.save(order);
        if (i <= 500) {
          ReturnRequest rr = new ReturnRequest();
          rr.setOrder(order);
          rr.setReason(i % 3 == 0 ? "Damaged packaging" : "Wrong size or variant");
          rr.setApproved(i % 2 == 0);
          returns.save(rr);
        }
      }

      var agentList = agents.findAll();
      var orderList = orders.findAll();
      for (int i = 0; i < Math.min(600, orderList.size()); i++) {
        Delivery d = new Delivery();
        d.setOrder(orderList.get(i));
        d.setAgent(agentList.get(i % agentList.size()));
        d.setEta(Instant.now().plusSeconds((i % 48) * 3600L));
        d.setDelayed(i % 10 == 0);
        d.setStatus(i % 10 == 0 ? DeliveryStatus.DELAYED : DeliveryStatus.DELIVERED);
        deliveries.save(d);
      }

      for (int i = 0; i < 100; i++) {
        RiskAlert r = new RiskAlert();
        r.setTitle(i % 2 == 0 ? "High stockout probability on fast-moving SKU" : "Regional delivery delay cluster detected");
        r.setSeverity(i % 3 == 0 ? RiskSeverity.HIGH : RiskSeverity.MEDIUM);
        r.setScore(62 + i * 3);
        r.setReason("Rule engine detected repeated threshold breaches in the last operating window.");
        r.setRecommendedAction("Review replenishment and route balancing plan before next dispatch cycle.");
        r.setEntityType(i % 2 == 0 ? "PRODUCT" : "REGION");
        r.setEntityRef(i % 2 == 0 ? productList.get(i).getSku() : regions.get(i % regions.size()));
        r.setWarehouse(whs.get(i % whs.size()));
        risks.save(r);
      }
    };
  }

  private User user(String email, String name, RoleName role, PasswordEncoder encoder) {
    User user = new User();
    user.setEmail(email);
    user.setFullName(name);
    user.setPasswordHash(encoder.encode("password"));
    user.setRoles(Set.of(role));
    return user;
  }

  private String sampleProduct(int i) {
    String[] names = {"iPhone 15", "Galaxy S24", "ThinkPad X1", "Air Fryer Pro", "Running Shoes", "Protein Pack", "Noise Buds", "Office Chair"};
    return names[i % names.length] + " #" + i;
  }
}
