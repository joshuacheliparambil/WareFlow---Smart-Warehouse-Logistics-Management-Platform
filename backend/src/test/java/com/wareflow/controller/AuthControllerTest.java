package com.wareflow.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wareflow.domain.Enums.RoleName;
import com.wareflow.dto.AuthDtos.*;
import com.wareflow.service.AuthService;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {
  @Autowired MockMvc mvc;
  @Autowired ObjectMapper mapper;
  @MockBean AuthService authService;

  @Test
  void loginReturnsJwt() throws Exception {
    when(authService.login(any())).thenReturn(new LoginResponse("jwt-token", "admin@wareflow.dev", "Avery Admin", Set.of(RoleName.ADMIN)));
    mvc.perform(post("/api/auth/login")
      .contentType(MediaType.APPLICATION_JSON)
      .content(mapper.writeValueAsString(new LoginRequest("admin@wareflow.dev", "password"))))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.token").value("jwt-token"));
  }
}
