package com.finx.dispute.dto.response;

import com.finx.dispute.entity.Dispute;
import com.finx.dispute.entity.DisputeStatus;

import java.time.Instant;
import java.util.UUID;

public class DisputeResponse {
    private UUID id;
    private UUID dealId;
    private UUID milestoneId;
    private UUID raisedBy;
    private String reason;
    private DisputeStatus status;
    private String resolutionNotes;
    private Instant resolvedAt;
    private UUID resolvedBy;
    private Instant createdAt;

    public DisputeResponse() {
    }

    public static DisputeResponse fromEntity(Dispute dispute) {
        DisputeResponse response = new DisputeResponse();
        response.setId(dispute.getId());
        response.setDealId(dispute.getDealId());
        response.setMilestoneId(dispute.getMilestoneId());
        response.setRaisedBy(dispute.getRaisedBy());
        response.setReason(dispute.getReason());
        response.setStatus(dispute.getStatus());
        response.setResolutionNotes(dispute.getResolutionNotes());
        response.setResolvedAt(dispute.getResolvedAt());
        response.setResolvedBy(dispute.getResolvedBy());
        response.setCreatedAt(dispute.getCreatedAt());
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

    public UUID getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(UUID milestoneId) {
        this.milestoneId = milestoneId;
    }

    public UUID getRaisedBy() {
        return raisedBy;
    }

    public void setRaisedBy(UUID raisedBy) {
        this.raisedBy = raisedBy;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public DisputeStatus getStatus() {
        return status;
    }

    public void setStatus(DisputeStatus status) {
        this.status = status;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public UUID getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(UUID resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
