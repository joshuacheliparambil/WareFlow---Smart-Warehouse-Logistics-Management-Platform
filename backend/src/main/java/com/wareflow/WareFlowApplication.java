package com.wareflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@EnableCaching
@SpringBootApplication
public class WareFlowApplication {
  public static void main(String[] args) {
    SpringApplication.run(WareFlowApplication.class, args);
  }
}
