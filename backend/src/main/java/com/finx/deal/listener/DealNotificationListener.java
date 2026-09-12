package com.finx.deal.listener;

import com.finx.deal.event.DealCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class DealNotificationListener {

    private static final Logger log = LoggerFactory.getLogger(DealNotificationListener.class);

    private final org.springframework.mail.MailSender mailSender;

    public DealNotificationListener(org.springframework.mail.MailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    @EventListener
    public void handleDealCreated(DealCreatedEvent event) {
        log.info("[ASYNC EMAIL DISPATCH] Received deal creation event for deal: {}", event.getDeal().getId());
        
        try {
            org.springframework.mail.SimpleMailMessage message = new org.springframework.mail.SimpleMailMessage();
            message.setFrom("finx-system@ethereal.email");
            message.setTo(event.getVendorEmail());
            message.setSubject("New FinX Project Assigned: " + event.getDeal().getTitle());
            message.setText("Hello,\n\nYou have been assigned a new project on FINX: " + event.getDeal().getTitle() + 
                            "\nAmount: " + event.getDeal().getTotalAmount() + " " + event.getDeal().getCurrency() + 
                            "\nProject ID: " + event.getDeal().getProjectId() + 
                            "\n\nPlease login to accept the project.");

            mailSender.send(message);

            log.info(">>>> Successfully dispatched email to: {}", event.getVendorEmail());
            
        } catch (Exception e) {
            log.error("Failed to send async email to {}", event.getVendorEmail(), e);
        }
    }
}
