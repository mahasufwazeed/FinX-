package com.finx.auth.dto.response;

public class GoogleOAuthConfigResponse {

    private boolean configured;
    private String clientId;
    private String redirectUri;

    public GoogleOAuthConfigResponse() {
    }

    public GoogleOAuthConfigResponse(boolean configured, String clientId, String redirectUri) {
        this.configured = configured;
        this.clientId = clientId;
        this.redirectUri = redirectUri;
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
}
