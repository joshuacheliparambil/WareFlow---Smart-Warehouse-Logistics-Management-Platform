package com.wareflow.repository;

import com.wareflow.entity.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface DeliveryAgentRepository extends JpaRepository<DeliveryAgent, Long> {}
