package com.finx.escrow.dto.request;

public class ReleaseEscrowRequest {

    private String comment;

    public ReleaseEscrowRequest() {
    }

    public ReleaseEscrowRequest(String comment) {
        this.comment = comment;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
