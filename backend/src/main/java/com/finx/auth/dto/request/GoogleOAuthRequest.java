package com.finx.auth.dto.request;

import com.finx.common.enums.Role;
import jakarta.validation.constraints.NotBlank;

public class GoogleOAuthRequest {

    @NotBlank(message = "Authorization code is required")
    private String code;

    private String redirectUri;

    private Role role;

    public GoogleOAuthRequest() {
    }

    public GoogleOAuthRequest(String code, String redirectUri, Role role) {
        this.code = code;
        this.redirectUri = redirectUri;
        this.role = role;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getRedirectUri() {
        return redirectUri;
    }

    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
