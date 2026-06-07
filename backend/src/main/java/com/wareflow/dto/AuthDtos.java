package com.wareflow.dto;

import com.wareflow.domain.Enums.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

public final class AuthDtos {
  private AuthDtos() {}
  public record LoginRequest(@Email String email, @NotBlank String password) {}
  public record LoginResponse(String token, String email, String fullName, Set<RoleName> roles) {}
}
