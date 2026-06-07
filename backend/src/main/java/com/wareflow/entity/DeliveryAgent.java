package com.wareflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_agents")
public class DeliveryAgent {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  private String region;
  private double onTimeRate;
  private double averageRating;
  private int activeDeliveries;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getRegion() { return region; }
  public void setRegion(String region) { this.region = region; }
  public double getOnTimeRate() { return onTimeRate; }
  public void setOnTimeRate(double onTimeRate) { this.onTimeRate = onTimeRate; }
  public double getAverageRating() { return averageRating; }
  public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
  public int getActiveDeliveries() { return activeDeliveries; }
  public void setActiveDeliveries(int activeDeliveries) { this.activeDeliveries = activeDeliveries; }
}
