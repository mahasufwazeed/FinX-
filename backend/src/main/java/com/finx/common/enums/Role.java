package com.finx.common.enums;

public enum Role {
    BUYER,
    SELLER,
    ADMIN,
    PROJECT_MANAGER,
    FINANCE;

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
