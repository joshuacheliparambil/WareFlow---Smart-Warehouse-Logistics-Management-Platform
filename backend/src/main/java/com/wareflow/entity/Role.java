package com.wareflow.entity;

import com.wareflow.domain.Enums.RoleName;
import jakarta.persistence.*;

@Entity
@Table(name = "roles", indexes = @Index(name = "idx_role_name", columnList = "name", unique = true))
public class Role {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  @Enumerated(EnumType.STRING)
  @Column(nullable = false, unique = true)
  private RoleName name;
  private String description;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public RoleName getName() { return name; }
  public void setName(RoleName name) { this.name = name; }
  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }
}
