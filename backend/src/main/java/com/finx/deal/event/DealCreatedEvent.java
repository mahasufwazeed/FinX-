package com.finx.deal.event;

import com.finx.deal.entity.Deal;

public class DealCreatedEvent {

    private final Deal deal;
    private final String vendorEmail;

    public DealCreatedEvent(Deal deal, String vendorEmail) {
        this.deal = deal;
        this.vendorEmail = vendorEmail;
    }

    public Deal getDeal() {
        return deal;
    }

    public String getVendorEmail() {
        return vendorEmail;
    }
}
