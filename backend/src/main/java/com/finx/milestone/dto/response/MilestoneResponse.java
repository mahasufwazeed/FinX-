package com.finx.milestone.dto.response;

import com.finx.milestone.entity.Milestone;
import com.finx.milestone.entity.MilestoneStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class MilestoneResponse {

    private UUID id;
    private UUID dealId;
    private UUID projectId; // Frontend alias
    private String title;
    private String description;
    private int sequence;
    private BigDecimal amount;
    private String currency;
    private Instant dueDate;
    private MilestoneStatus status;
    private List<DeliverableResponse> deliverables = new ArrayList<>();
    private Instant createdAt;
    private Instant updatedAt;

    public MilestoneResponse() {
    }

    public static MilestoneResponse fromEntity(Milestone milestone) {
        MilestoneResponse response = new MilestoneResponse();
        response.setId(milestone.getId());
        response.setDealId(milestone.getDealId());
        response.setProjectId(milestone.getDealId());
        response.setTitle(milestone.getTitle());
        response.setDescription(milestone.getDescription());
        response.setSequence(milestone.getSequence());
        response.setAmount(milestone.getAmount());
        response.setCurrency(milestone.getCurrency());
        response.setDueDate(milestone.getDueDate());
        response.setStatus(milestone.getStatus());
        if (milestone.getDeliverables() != null) {
            response.setDeliverables(milestone.getDeliverables().stream()
                    .map(DeliverableResponse::fromEntity)
                    .collect(Collectors.toList()));
        }
        response.setCreatedAt(milestone.getCreatedAt());
        response.setUpdatedAt(milestone.getUpdatedAt());
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

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getSequence() {
        return sequence;
    }

    public void setSequence(int sequence) {
        this.sequence = sequence;
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

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public MilestoneStatus getStatus() {
        return status;
    }

    public void setStatus(MilestoneStatus status) {
        this.status = status;
    }

    public List<DeliverableResponse> getDeliverables() {
        return deliverables;
    }

    public void setDeliverables(List<DeliverableResponse> deliverables) {
        this.deliverables = deliverables;
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
