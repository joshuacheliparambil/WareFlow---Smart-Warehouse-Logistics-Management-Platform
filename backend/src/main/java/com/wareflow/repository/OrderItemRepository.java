package com.wareflow.repository;

import com.wareflow.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}
