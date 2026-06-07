# API Contracts

Base path: `/api`

## Auth

- `POST /auth/login`
  - Request: `{ "email": "admin@wareflow.dev", "password": "password" }`
  - Response: `{ "token": "...", "email": "...", "fullName": "...", "roles": ["ADMIN"] }`

## Inventory

- `GET /inventory/products`
- `PATCH /inventory/products/{sku}/stock`
  - Request: `{ "quantity": 12, "reason": "Inbound shipment", "direction": "INBOUND" }`

## Orders

- `GET /orders`
- `POST /orders`
- `POST /orders/{id}/cancel`

## Deliveries

- `GET /deliveries`
- `POST /deliveries/assign?orderId=1&agentId=4`

## Dashboard

- `GET /dashboard/metrics`

## Risk Radar

- `GET /risk-radar`
- `POST /risk-radar/refresh`

Swagger UI is available at `/swagger-ui.html`.
