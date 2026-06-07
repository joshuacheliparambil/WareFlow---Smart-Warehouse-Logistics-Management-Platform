package com.wareflow.repository;

import com.wareflow.entity.RiskAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface RiskAlertRepository extends JpaRepository<RiskAlert, Long> {
  List<RiskAlert> findTop20ByResolvedFalseOrderByScoreDesc();
}
