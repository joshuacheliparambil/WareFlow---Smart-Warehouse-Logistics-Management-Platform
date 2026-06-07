# Recruiter Walkthrough

## What Problem This Solves

WareFlow helps logistics teams manage inventory, order fulfillment, delivery performance, returns, and operational risk from one internal platform.

## Engineering Concepts Demonstrated

- Full-stack TypeScript and Java implementation.
- REST API design with validation and typed DTOs.
- JWT authentication and role-based authorization.
- Relational data modeling with indexes.
- Event-driven architecture using Kafka events.
- Redis caching for read-heavy operational screens.
- Rule-based risk scoring with explainable recommendations.
- Unit, service, controller, and integration-test-ready structure.
- Dockerized local environment and CI pipeline.

## Why Kafka Is Used

Warehouse systems produce important operational events. Kafka decouples event producers from consumers so analytics, alerting, audit logs, and notifications can evolve independently.

## Why Redis Is Used

Inventory and dashboard data are read frequently. Redis reduces database pressure and makes the operational console feel fast under repeated reads.

## How JWT Security Works

Users authenticate through `/api/auth/login`. The backend verifies credentials, signs a JWT with user identity and roles, and protects API routes with Spring Security method authorization.

## How Risk Radar Works

Risk Radar evaluates stock thresholds, warehouse utilization, delivery-agent performance, and return anomalies. Each alert includes a score, severity, reason, and recommended action so teams can act before failures happen.

## Tradeoffs

The first version keeps risk detection rule-based because it is explainable, deterministic, and free. The alert interface is designed so a future ML model can replace or augment the rules.

## Scaling Path

Split the modular monolith into inventory, orders, delivery, analytics, and alerting services once independent scaling is needed. Kafka event contracts already prepare the boundaries.
