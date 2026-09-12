package com.finx.milestone.repository;

import com.finx.milestone.entity.Milestone;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {
    List<Milestone> findByDealIdOrderBySequenceAsc(UUID dealId);
    List<Milestone> findByDealIdInOrderByCreatedAtDesc(List<UUID> dealIds);
    long countByDealId(UUID dealId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from Milestone m where m.id = :id")
    java.util.Optional<Milestone> findByIdForUpdate(@Param("id") UUID id);
}
