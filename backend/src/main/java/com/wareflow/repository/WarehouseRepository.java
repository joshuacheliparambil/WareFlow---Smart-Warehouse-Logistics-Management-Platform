package com.wareflow.repository;

import com.wareflow.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {}
