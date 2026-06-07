package com.wareflow.service;

import com.wareflow.dto.AuthDtos.*;
import com.wareflow.exception.ApiException;
import com.wareflow.repository.UserRepository;
import com.wareflow.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.*;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
  private final AuthenticationManager authManager;
  private final UserRepository users;
  private final JwtService jwtService;

  public AuthService(AuthenticationManager authManager, UserRepository users, JwtService jwtService) {
    this.authManager = authManager;
    this.users = users;
    this.jwtService = jwtService;
  }

  public LoginResponse login(LoginRequest request) {
    authManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
    var user = users.findByEmail(request.email()).orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
    return new LoginResponse(jwtService.generate(user), user.getEmail(), user.getFullName(), user.getRoles());
  }
}
