package com.finx.escrow.repository;

import com.finx.escrow.entity.EscrowAccount;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EscrowAccountRepository extends JpaRepository<EscrowAccount, UUID> {
    Optional<EscrowAccount> findByDealId(UUID dealId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from EscrowAccount e where e.dealId = :dealId")
    Optional<EscrowAccount> findByDealIdForUpdate(@Param("dealId") UUID dealId);
}
