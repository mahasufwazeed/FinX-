package com.finx.payment.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateOrderResponse {

    private String keyId;
    private String orderId;
    private BigDecimal amount;
    private String currency;
    private UUID paymentId;
    private String dealTitle;
    private String milestoneTitle;

    public CreateOrderResponse() {
    }

    public CreateOrderResponse(String keyId, String orderId, BigDecimal amount, String currency, UUID paymentId, String dealTitle, String milestoneTitle) {
        this.keyId = keyId;
        this.orderId = orderId;
        this.amount = amount;
        this.currency = currency;
        this.paymentId = paymentId;
        this.dealTitle = dealTitle;
        this.milestoneTitle = milestoneTitle;
    }

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public UUID getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(UUID paymentId) {
        this.paymentId = paymentId;
    }

    public String getDealTitle() {
        return dealTitle;
    }

    public void setDealTitle(String dealTitle) {
        this.dealTitle = dealTitle;
    }

    public String getMilestoneTitle() {
        return milestoneTitle;
    }

    public void setMilestoneTitle(String milestoneTitle) {
        this.milestoneTitle = milestoneTitle;
    }
}
