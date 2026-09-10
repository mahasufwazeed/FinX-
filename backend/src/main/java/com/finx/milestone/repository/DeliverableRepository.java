package com.finx.milestone.repository;

import com.finx.milestone.entity.Deliverable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeliverableRepository extends JpaRepository<Deliverable, UUID> {
    List<Deliverable> findByMilestoneIdOrderBySubmittedAtDesc(UUID milestoneId);
    List<Deliverable> findBySubmittedByOrderBySubmittedAtDesc(UUID submittedBy);
}
