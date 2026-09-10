package com.finx.payment.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CreateOrderRequest {

    @NotNull(message = "Deal ID is required")
    private UUID dealId;

    @NotNull(message = "Milestone ID is required")
    private UUID milestoneId;

    private String idempotencyKey;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(UUID dealId, UUID milestoneId) {
        this.dealId = dealId;
        this.milestoneId = milestoneId;
    }

    public UUID getDealId() {
        return dealId;
    }

    public void setDealId(UUID dealId) {
        this.dealId = dealId;
    }

    public UUID getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(UUID milestoneId) {
        this.milestoneId = milestoneId;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }
}
