package com.finx.deal.repository;

import com.finx.deal.entity.Deal;
import com.finx.deal.entity.DealStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DealRepository extends JpaRepository<Deal, UUID> {

    List<Deal> findByBuyerId(UUID buyerId);

    List<Deal> findBySellerId(UUID sellerId);

    List<Deal> findByStatus(DealStatus status);
}
