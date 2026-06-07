package com.wareflow.controller;

import com.wareflow.dto.AuthDtos.*;
import com.wareflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final AuthService authService;
  public AuthController(AuthService authService) { this.authService = authService; }
  @PostMapping("/login")
  LoginResponse login(@Valid @RequestBody LoginRequest request) { return authService.login(request); }
}
