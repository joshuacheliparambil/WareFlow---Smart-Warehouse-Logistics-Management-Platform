package com.wareflow.repository;

import com.wareflow.entity.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {}
