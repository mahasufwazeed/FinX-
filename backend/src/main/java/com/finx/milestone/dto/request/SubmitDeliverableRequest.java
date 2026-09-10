package com.finx.milestone.dto.request;

import jakarta.validation.constraints.NotBlank;

public class SubmitDeliverableRequest {

    @NotBlank(message = "Deliverable file name or title is required")
    private String fileName;

    @NotBlank(message = "Deliverable file URL or repository link is required")
    private String fileUrl;

    private String description;

    public SubmitDeliverableRequest() {
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
}
