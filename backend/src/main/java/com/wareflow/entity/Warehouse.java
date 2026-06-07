package com.wareflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "warehouses")
public class Warehouse {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Column(nullable = false)
  private String name;
  @Column(nullable = false)
  private String region;
  @Column(nullable = false)
  private int capacityUnits;
  @Column(nullable = false)
  private int usedUnits;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getRegion() { return region; }
  public void setRegion(String region) { this.region = region; }
  public int getCapacityUnits() { return capacityUnits; }
  public void setCapacityUnits(int capacityUnits) { this.capacityUnits = capacityUnits; }
  public int getUsedUnits() { return usedUnits; }
  public void setUsedUnits(int usedUnits) { this.usedUnits = usedUnits; }
}
