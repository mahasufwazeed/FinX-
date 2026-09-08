package com.finx.common.enums;

public enum Role {
    BUYER,
    SELLER,
    ADMIN;

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
