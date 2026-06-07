package com.wareflow.repository;

import com.wareflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
}
