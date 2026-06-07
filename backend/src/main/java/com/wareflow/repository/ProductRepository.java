package com.wareflow.repository;

import com.wareflow.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface ProductRepository extends JpaRepository<Product, Long> {
  Optional<Product> findBySku(String sku);
  List<Product> findByStockLessThanEqual(int stock);
}
