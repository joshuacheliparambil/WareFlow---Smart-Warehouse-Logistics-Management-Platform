# Deployment Guide

## Local

Run the complete stack with:

```bash
docker compose up --build
```

## AWS-Ready Path

- Backend: package Spring Boot as a container and deploy to ECS Fargate.
- Frontend: build static assets and serve through S3 plus CloudFront, or use the provided Nginx container.
- Database: replace compose PostgreSQL with Amazon RDS PostgreSQL.
- Cache: replace Redis container with Amazon ElastiCache.
- Kafka: replace local Kafka with Amazon MSK or a managed Kafka provider.
- Secrets: store JWT secret and database credentials in AWS Secrets Manager.

## Production Checklist

- Disable seed data.
- Rotate JWT secret.
- Enable CORS allowlist.
- Add structured logging and tracing.
- Configure autoscaling on CPU and request latency.
- Add RDS backups and Redis eviction policy.
