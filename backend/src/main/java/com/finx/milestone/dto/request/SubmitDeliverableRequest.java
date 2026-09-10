package com.finx.milestone.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SubmitDeliverableRequest {

    @NotBlank(message = "Deliverable file name or title is required")
    @Size(max = 255, message = "Deliverable file name cannot exceed 255 characters")
    private String fileName;

    @NotBlank(message = "Deliverable file URL or repository link is required")
    @Size(max = 2048, message = "Deliverable file URL cannot exceed 2048 characters")
    private String fileUrl;

    @Size(max = 4000, message = "Description cannot exceed 4000 characters")
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
