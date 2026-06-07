package com.wareflow.repository;

import com.wareflow.entity.InventoryTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface InventoryTransactionRepository extends JpaRepository<InventoryTransaction, Long> {}
