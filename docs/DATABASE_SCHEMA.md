# Database Schema

Core entities:

- User: email, password hash, full name, roles.
- Warehouse: region, capacity units, used units.
- Product: SKU, name, category, stock, reorder point, damaged units, batch code, expiry date, warehouse.
- InventoryTransaction: product, direction, quantity, reason, created date.
- CustomerOrder: order number, status, region, failed fulfillment reason, total, created date.
- OrderItem: order, product, quantity, unit price.
- Delivery: order, agent, status, ETA, delayed flag.
- DeliveryAgent: name, region, on-time rate, rating, active deliveries.
- ReturnRequest: order, reason, approved flag, created date.
- RiskAlert: title, severity, score, reason, recommended action, entity type/ref, warehouse, resolved flag.

Important indexes:

- product SKU
- order status
- delivery status
- warehouse ID through product relation
- created date on orders, risk alerts, returns, and transactions
