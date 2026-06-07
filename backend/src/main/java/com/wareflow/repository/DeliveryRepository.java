package com.wareflow.repository;

import com.wareflow.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {}
