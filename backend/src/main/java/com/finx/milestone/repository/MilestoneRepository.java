package com.finx.milestone.repository;

import com.finx.milestone.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {
    List<Milestone> findByDealIdOrderBySequenceAsc(UUID dealId);
    List<Milestone> findByDealIdInOrderByCreatedAtDesc(List<UUID> dealIds);
    long countByDealId(UUID dealId);
}
