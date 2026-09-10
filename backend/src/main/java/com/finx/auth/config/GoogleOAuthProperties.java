package com.finx.auth.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "oauth.google")
public class GoogleOAuthProperties {

    private static final Logger log = LoggerFactory.getLogger(GoogleOAuthProperties.class);

    private String clientId;
    private String clientSecret;
    private String redirectUri = "http://localhost:8080/api/auth/google/callback";
    private String frontendRedirectUrl = "http://localhost:3000/auth/callback/google";

    @PostConstruct
    public void validateConfiguration() {
        if (!isConfigured()) {
            log.warn("================================================================================");
            log.warn("[OAUTH CONFIGURATION] Google OAuth 2.0 is NOT configured on this server.");
            log.warn("Missing required environment variables: GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET.");
            log.warn("Google Sign-In will prompt users to configure credentials or sign in with email.");
            log.warn("Expected Redirect URI: {}", redirectUri);
            log.warn("================================================================================");
        } else {
            log.info("================================================================================");
            log.info("[OAUTH CONFIGURATION] Google OAuth 2.0 is CONFIGURED and ACTIVE.");
            String maskedId = clientId.length() > 8 ? clientId.substring(0, 8) + "..." : "[CONFIGURED]";
            log.info("Client ID: {}", maskedId);
            log.info("Client Secret: [CONFIGURED - NEVER LOGGED]");
            log.info("Backend Redirect URI: {}", redirectUri);
            log.info("Frontend Redirect URL: {}", frontendRedirectUrl);
            log.info("================================================================================");
        }
    }

    public boolean isConfigured() {
        return clientId != null && !clientId.trim().isEmpty() &&
               clientSecret != null && !clientSecret.trim().isEmpty();
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public String getFrontendRedirectUrl() {
        return frontendRedirectUrl;
    }

    public void setFrontendRedirectUrl(String frontendRedirectUrl) {
        this.frontendRedirectUrl = frontendRedirectUrl;
    }
}
