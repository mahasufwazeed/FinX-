package com.finx.auth.service;

import com.finx.audit.service.AuditService;
import com.finx.auth.dto.request.LoginRequest;
import com.finx.auth.dto.request.LogoutRequest;
import com.finx.auth.dto.request.RegisterRequest;
import com.finx.auth.dto.request.TokenRefreshRequest;
import com.finx.auth.dto.response.AuthResponse;
import com.finx.auth.dto.response.UserSummaryResponse;
import com.finx.auth.entity.RefreshToken;
import com.finx.auth.repository.RefreshTokenRepository;
import com.finx.common.enums.Role;
import com.finx.common.enums.UserStatus;
import com.finx.exception.BadRequestException;
import com.finx.exception.DuplicateResourceException;
import com.finx.exception.TokenRefreshException;
import com.finx.exception.UnauthorizedException;
import com.finx.security.jwt.JwtTokenProvider;
import com.finx.security.service.UserPrincipal;
import com.finx.user.entity.User;
import com.finx.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditService auditService;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("ADMIN accounts cannot be registered publicly");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists");
        }

        User user = new User(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                UserStatus.ACTIVE
        );

        User savedUser = userRepository.saveAndFlush(user);

        // Issue tokens
        String accessToken = jwtTokenProvider.generateAccessToken(savedUser);
        String rawRefreshToken = jwtTokenProvider.generateRefreshTokenString();
        String tokenHash = jwtTokenProvider.hashToken(rawRefreshToken);
        Instant refreshExpiry = Instant.now().plusMillis(jwtTokenProvider.getRefreshTokenExpirationMs());

        RefreshToken refreshToken = new RefreshToken(savedUser, tokenHash, refreshExpiry);
        refreshTokenRepository.saveAndFlush(refreshToken);

        auditService.logEvent(
                savedUser.getId(),
                "USER_REGISTERED",
                "USER",
                savedUser.getId().toString(),
                "Registered with role " + savedUser.getRole()
        );

        return new AuthResponse(
                accessToken,
                rawRefreshToken,
                jwtTokenProvider.getAccessTokenExpirationMs() / 1000,
                UserSummaryResponse.fromEntity(savedUser)
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            auditService.logEvent(
                    user.getId(),
                    "FAILED_LOGIN_ATTEMPT",
                    "USER",
                    user.getId().toString(),
                    "Invalid password attempt for email: " + request.getEmail()
            );
            throw new BadCredentialsException("Invalid email or password");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("User account is suspended");
        }

        // Issue new token pair
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String rawRefreshToken = jwtTokenProvider.generateRefreshTokenString();
        String tokenHash = jwtTokenProvider.hashToken(rawRefreshToken);
        Instant refreshExpiry = Instant.now().plusMillis(jwtTokenProvider.getRefreshTokenExpirationMs());

        RefreshToken refreshToken = new RefreshToken(user, tokenHash, refreshExpiry);
        refreshTokenRepository.save(refreshToken);

        auditService.logEvent(
                user.getId(),
                "USER_LOGIN",
                "USER",
                user.getId().toString(),
                "User successfully logged in"
        );

        return new AuthResponse(
                accessToken,
                rawRefreshToken,
                jwtTokenProvider.getAccessTokenExpirationMs() / 1000,
                UserSummaryResponse.fromEntity(user)
        );
    }

    @Transactional
    public AuthResponse refreshToken(TokenRefreshRequest request) {
        String rawToken = request.getRefreshToken();
        String tokenHash = jwtTokenProvider.hashToken(rawToken);

        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new TokenRefreshException(rawToken, "Invalid refresh token"));

        if (storedToken.isRevoked()) {
            // Security alert: Potential token reuse. Revoke all active tokens for this user.
            refreshTokenRepository.revokeAllActiveUserTokens(storedToken.getUser(), Instant.now());
            auditService.logEvent(
                    storedToken.getUser().getId(),
                    "REVOKED_TOKEN_REUSE_ATTEMPT",
                    "REFRESH_TOKEN",
                    storedToken.getId() != null ? storedToken.getId().toString() : "N/A",
                    "Attempted reuse of already revoked refresh token. All active user tokens revoked."
            );
            throw new TokenRefreshException(rawToken, "Refresh token has been revoked");
        }

        if (storedToken.isExpired()) {
            throw new TokenRefreshException(rawToken, "Refresh token has expired. Please login again.");
        }

        User user = storedToken.getUser();
        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("User account is suspended");
        }

        // Token rotation: Revoke current token
        storedToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(storedToken);

        // Issue new token pair
        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRawRefreshToken = jwtTokenProvider.generateRefreshTokenString();
        String newTokenHash = jwtTokenProvider.hashToken(newRawRefreshToken);
        Instant newExpiry = Instant.now().plusMillis(jwtTokenProvider.getRefreshTokenExpirationMs());

        RefreshToken newRefreshToken = new RefreshToken(user, newTokenHash, newExpiry);
        RefreshToken savedNewToken = refreshTokenRepository.save(newRefreshToken);
        UUID auditId = (savedNewToken != null && savedNewToken.getId() != null)
                ? savedNewToken.getId()
                : newRefreshToken.getId();

        auditService.logEvent(
                user.getId(),
                "TOKEN_REFRESHED",
                "REFRESH_TOKEN",
                auditId != null ? auditId.toString() : "N/A",
                "Token rotated successfully"
        );

        return new AuthResponse(
                newAccessToken,
                newRawRefreshToken,
                jwtTokenProvider.getAccessTokenExpirationMs() / 1000,
                UserSummaryResponse.fromEntity(user)
        );
    }

    @Transactional
    public void logout(LogoutRequest request) {
        if (request.getRefreshToken() != null && !request.getRefreshToken().isBlank()) {
            String tokenHash = jwtTokenProvider.hashToken(request.getRefreshToken());
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
                token.setRevokedAt(Instant.now());
                refreshTokenRepository.save(token);
                auditService.logEvent(
                        token.getUser().getId(),
                        "USER_LOGOUT",
                        "REFRESH_TOKEN",
                        token.getId() != null ? token.getId().toString() : "N/A",
                        "User logged out and revoked refresh token"
                );
            });
        }
    }

    @Transactional(readOnly = true)
    public UserSummaryResponse getCurrentUser(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("User profile not found"));
        return UserSummaryResponse.fromEntity(user);
    }
}
