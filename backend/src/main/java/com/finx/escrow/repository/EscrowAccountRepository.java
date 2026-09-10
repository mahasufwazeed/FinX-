package com.finx.escrow.repository;

import com.finx.escrow.entity.EscrowAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EscrowAccountRepository extends JpaRepository<EscrowAccount, UUID> {
    Optional<EscrowAccount> findByDealId(UUID dealId);
}
