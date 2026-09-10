package com.finx.payment.repository;

import com.finx.payment.entity.Payment;
import com.finx.payment.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByDealIdOrderByCreatedAtDesc(UUID dealId);
    List<Payment> findByBuyerIdOrderByCreatedAtDesc(UUID buyerId);
    Optional<Payment> findByProviderOrderId(String providerOrderId);
    Optional<Payment> findByIdempotencyKey(String idempotencyKey);
    Optional<Payment> findByMilestoneIdAndStatus(UUID milestoneId, PaymentStatus status);
}
