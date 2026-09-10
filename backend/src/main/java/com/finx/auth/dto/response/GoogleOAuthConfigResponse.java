package com.finx.auth.dto.response;

public class GoogleOAuthConfigResponse {

    private boolean configured;
    private String clientId;
    private String redirectUri;
    private String authUrl;

    public GoogleOAuthConfigResponse() {
    }

    public GoogleOAuthConfigResponse(boolean configured, String clientId, String redirectUri) {
        this.configured = configured;
        this.clientId = clientId;
        this.redirectUri = redirectUri;
    }

    public GoogleOAuthConfigResponse(boolean configured, String clientId, String redirectUri, String authUrl) {
        this.configured = configured;
        this.clientId = clientId;
        this.redirectUri = redirectUri;
        this.authUrl = authUrl;
    }

    public boolean isConfigured() {
        return configured;
    }

    public void setConfigured(boolean configured) {
        this.configured = configured;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public String getAuthUrl() {
        return authUrl;
    }

    public void setAuthUrl(String authUrl) {
        this.authUrl = authUrl;
    }
}
