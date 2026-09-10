package com.finx.milestone.dto.response;

import com.finx.milestone.entity.Deliverable;
import com.finx.milestone.entity.DeliverableStatus;

import java.time.Instant;
import java.util.UUID;

public class DeliverableResponse {

    private UUID id;
    private UUID milestoneId;
    private UUID submittedBy;
    private String fileName;
    private String fileUrl;
    private String description;
    private DeliverableStatus status;
    private Instant submittedAt;
    private Instant reviewedAt;
    private UUID reviewedBy;
    private String rejectionReason;

    public DeliverableResponse() {
    }

    public static DeliverableResponse fromEntity(Deliverable deliverable) {
        DeliverableResponse response = new DeliverableResponse();
        response.setId(deliverable.getId());
        response.setMilestoneId(deliverable.getMilestoneId());
        response.setSubmittedBy(deliverable.getSubmittedBy());
        response.setFileName(deliverable.getFileName());
        response.setFileUrl(deliverable.getFileUrl());
        response.setDescription(deliverable.getDescription());
        response.setStatus(deliverable.getStatus());
        response.setSubmittedAt(deliverable.getSubmittedAt());
        response.setReviewedAt(deliverable.getReviewedAt());
        response.setReviewedBy(deliverable.getReviewedBy());
        response.setRejectionReason(deliverable.getRejectionReason());
        return response;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getMilestoneId() {
        return milestoneId;
    }

    public void setMilestoneId(UUID milestoneId) {
        this.milestoneId = milestoneId;
    }

    public UUID getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(UUID submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DeliverableStatus getStatus() {
        return status;
    }

    public void setStatus(DeliverableStatus status) {
        this.status = status;
    }

    public Instant getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(Instant submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Instant getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(Instant reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public UUID getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(UUID reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
