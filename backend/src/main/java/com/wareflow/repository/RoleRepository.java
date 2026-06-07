package com.wareflow.repository;

import com.wareflow.domain.Enums.RoleName;
import com.wareflow.entity.Role;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(RoleName name);
}
