package com.finx.escrow.dto.response;

import com.finx.escrow.entity.EscrowAccount;
import com.finx.escrow.entity.EscrowAccountStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class EscrowAccountResponse {

    private UUID id;
    private UUID dealId;
    private BigDecimal balance;
    private String currency;
    private EscrowAccountStatus status;
    private Instant createdAt;
    private Instant updatedAt;

    public EscrowAccountResponse() {
    }

    public static EscrowAccountResponse fromEntity(EscrowAccount account) {
        EscrowAccountResponse response = new EscrowAccountResponse();
        response.setId(account.getId());
        response.setDealId(account.getDealId());
        response.setBalance(account.getBalance());
        response.setCurrency(account.getCurrency());
        response.setStatus(account.getStatus());
        response.setCreatedAt(account.getCreatedAt());
        response.setUpdatedAt(account.getUpdatedAt());
        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDealId() {
        return dealId;
    }

    public void setDealId(UUID dealId) {
        this.dealId = dealId;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public EscrowAccountStatus getStatus() {
        return status;
    }

    public void setStatus(EscrowAccountStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
