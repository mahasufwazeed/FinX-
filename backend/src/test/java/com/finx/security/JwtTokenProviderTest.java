package com.finx.security;

import com.finx.common.enums.Role;
import com.finx.common.enums.UserStatus;
import com.finx.security.jwt.JwtTokenProvider;
import com.finx.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String testSecret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long accessExpirationMs = 10000; // 10 seconds
    private final long refreshExpirationMs = 60000; // 60 seconds

    private User sampleUser;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(testSecret, accessExpirationMs, refreshExpirationMs);

        sampleUser = new User("Test Buyer", "buyer@finx.com", "hashedPass", Role.BUYER, UserStatus.ACTIVE);
        sampleUser.setId(UUID.randomUUID());
    }

    @Test
    @DisplayName("Should generate token and extract correct claims")
    void testGenerateAccessToken_ValidClaims() {
        String token = jwtTokenProvider.generateAccessToken(sampleUser);

        assertThat(token).isNotBlank();
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        assertThat(jwtTokenProvider.getUserIdFromToken(token)).isEqualTo(sampleUser.getId());
        assertThat(jwtTokenProvider.getEmailFromToken(token)).isEqualTo(sampleUser.getEmail());
        assertThat(jwtTokenProvider.getRoleFromToken(token)).isEqualTo(Role.BUYER);
    }

    @Test
    @DisplayName("Should fail validation for tampered token")
    void testValidateToken_TamperedSignature() {
        String token = jwtTokenProvider.generateAccessToken(sampleUser);
        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";

        assertThat(jwtTokenProvider.validateToken(tamperedToken)).isFalse();
    }

    @Test
    @DisplayName("Should fail validation for expired token")
    void testValidateToken_Expired() throws InterruptedException {
        // Create a provider with 1 millisecond expiration
        JwtTokenProvider shortLivedProvider = new JwtTokenProvider(testSecret, 1L, refreshExpirationMs);
        String token = shortLivedProvider.generateAccessToken(sampleUser);

        Thread.sleep(10); // Wait for expiration

        assertThat(shortLivedProvider.validateToken(token)).isFalse();
    }

    @Test
    @DisplayName("Should produce consistent SHA-256 hash for raw refresh tokens")
    void testHashToken_Deterministic() {
        String rawToken = jwtTokenProvider.generateRefreshTokenString();
        String hash1 = jwtTokenProvider.hashToken(rawToken);
        String hash2 = jwtTokenProvider.hashToken(rawToken);

        assertThat(hash1).isNotBlank();
        assertThat(hash1).isEqualTo(hash2);
        assertThat(hash1).hasSize(64); // SHA-256 hex string is 64 characters
    }
}
