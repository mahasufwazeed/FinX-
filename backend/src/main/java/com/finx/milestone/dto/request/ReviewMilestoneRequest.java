package com.finx.milestone.dto.request;

public class ReviewMilestoneRequest {

    private String reason;

    public ReviewMilestoneRequest() {
    }

    public ReviewMilestoneRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
