package com.finx.auth.controller;

import com.finx.auth.dto.request.LoginRequest;
import com.finx.auth.dto.request.LogoutRequest;
import com.finx.auth.dto.request.RegisterRequest;
import com.finx.auth.dto.request.TokenRefreshRequest;
import com.finx.auth.dto.response.AuthResponse;
import com.finx.auth.dto.response.UserSummaryResponse;
import com.finx.auth.service.AuthService;
import com.finx.common.response.ApiResponse;
import com.finx.security.service.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.finx.auth.config.GoogleOAuthProperties;
import com.finx.auth.dto.request.GoogleOAuthRequest;
import com.finx.auth.dto.response.GoogleOAuthConfigResponse;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, authentication, token refresh, and profile retrieval")
public class AuthController {

    private final AuthService authService;
    private final GoogleOAuthProperties googleOAuthProperties;

    public AuthController(AuthService authService) {
        this(authService, new GoogleOAuthProperties());
    }

    @org.springframework.beans.factory.annotation.Autowired
    public AuthController(AuthService authService, GoogleOAuthProperties googleOAuthProperties) {
        this.authService = authService;
        this.googleOAuthProperties = googleOAuthProperties;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user (Buyer or Seller)", description = "Public registration endpoint for Buyer or Seller accounts. Admin accounts cannot be registered publicly.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "User registered successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid request payload or unauthorized role"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "Email already registered")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Authenticate with email and password to receive JWT access and refresh tokens.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Login successful"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid email or password")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT access token", description = "Exchange a valid refresh token for a new access and rotated refresh token.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Invalid, expired, or revoked refresh token")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody TokenRefreshRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Revoke active refresh token to end user session.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Logged out successfully")
    })
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request);
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @GetMapping({"/oauth/google/config", "/google/config"})
    @Operation(summary = "Get Google OAuth configuration status", description = "Check if Google OAuth is configured and get the public client ID.")
    public ResponseEntity<ApiResponse<GoogleOAuthConfigResponse>> getGoogleOAuthConfig() {
        GoogleOAuthConfigResponse response = authService.getGoogleOAuthConfig();
        return ResponseEntity.ok(ApiResponse.success("OAuth configuration retrieved", response));
    }

    @PostMapping({"/oauth/google", "/google"})
    @Operation(summary = "Authenticate with Google OAuth code", description = "Exchange Google authorization code for FINX JWT access and refresh tokens.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Google authentication successful"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid code or unverified email")
    })
    public ResponseEntity<ApiResponse<AuthResponse>> authenticateWithGoogle(@Valid @RequestBody GoogleOAuthRequest request) {
        AuthResponse response = authService.authenticateWithGoogle(request);
        return ResponseEntity.ok(ApiResponse.success("Google authentication successful", response));
    }

    @GetMapping({"/google/login", "/oauth/google/login"})
    @Operation(summary = "Redirect to Google OAuth consent", description = "Initiates Google OAuth 2.0 flow by redirecting to Google.")
    public void redirectToGoogleOAuth(HttpServletResponse response) throws IOException {
        if (!googleOAuthProperties.isConfigured()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Google OAuth is not configured on the server.");
            return;
        }
        String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + URLEncoder.encode(googleOAuthProperties.getClientId(), StandardCharsets.UTF_8) +
                "&redirect_uri=" + URLEncoder.encode(googleOAuthProperties.getRedirectUri(), StandardCharsets.UTF_8) +
                "&response_type=code" +
                "&scope=" + URLEncoder.encode("openid email profile", StandardCharsets.UTF_8) +
                "&access_type=offline" +
                "&prompt=select_account";
        response.sendRedirect(googleAuthUrl);
    }

    @GetMapping({"/google/callback", "/oauth/google/callback"})
    @Operation(summary = "Google OAuth callback", description = "Callback endpoint for Google to redirect after user authentication.")
    public void handleGoogleCallback(
            @RequestParam(value = "code", required = false) String code,
            @RequestParam(value = "state", required = false) String state,
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "error_description", required = false) String errorDescription,
            HttpServletResponse response) throws IOException {

        String frontendRedirect = googleOAuthProperties.getFrontendRedirectUrl();
        if (frontendRedirect == null || frontendRedirect.trim().isEmpty()) {
            frontendRedirect = "http://localhost:3000/auth/callback/google";
        }

        if (error != null && !error.trim().isEmpty()) {
            response.sendRedirect(frontendRedirect + "?error=" + URLEncoder.encode(error, StandardCharsets.UTF_8) +
                    (errorDescription != null ? "&error_description=" + URLEncoder.encode(errorDescription, StandardCharsets.UTF_8) : ""));
            return;
        }

        if (code == null || code.trim().isEmpty()) {
            response.sendRedirect(frontendRedirect + "?error=missing_code");
            return;
        }

        try {
            GoogleOAuthRequest authRequest = new GoogleOAuthRequest(code, googleOAuthProperties.getRedirectUri(), null);

            AuthResponse authResponse = authService.authenticateWithGoogle(authRequest);

            String roleStr = authResponse.getUser().getRole() != null ? authResponse.getUser().getRole().name() : "BUYER";
            String targetUrl = frontendRedirect +
                    "?accessToken=" + URLEncoder.encode(authResponse.getAccessToken(), StandardCharsets.UTF_8) +
                    "&refreshToken=" + URLEncoder.encode(authResponse.getRefreshToken(), StandardCharsets.UTF_8) +
                    "&role=" + URLEncoder.encode(roleStr, StandardCharsets.UTF_8);

            response.sendRedirect(targetUrl);
        } catch (Exception e) {
            response.sendRedirect(frontendRedirect + "?error=" + URLEncoder.encode(e.getMessage() != null ? e.getMessage() : "OAuth authentication failed", StandardCharsets.UTF_8));
        }
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get current user profile", description = "Retrieve current authenticated user details from JWT token.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Profile retrieved successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ApiResponse<UserSummaryResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal) {
        UserSummaryResponse response = authService.getCurrentUser(principal);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }
}
