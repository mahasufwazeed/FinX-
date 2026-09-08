package com.finx.deal.service;

import com.finx.audit.service.AuditService;
import com.finx.common.enums.Role;
import com.finx.deal.dto.request.CreateDealRequest;
import com.finx.deal.dto.response.DealResponse;
import com.finx.deal.entity.Deal;
import com.finx.deal.entity.DealStatus;
import com.finx.deal.repository.DealRepository;
import com.finx.exception.BadRequestException;
import com.finx.exception.ResourceNotFoundException;
import com.finx.security.service.UserPrincipal;
import com.finx.user.entity.User;
import com.finx.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DealService {

    private static final Logger log = LoggerFactory.getLogger(DealService.class);

    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public DealService(DealRepository dealRepository,
                       UserRepository userRepository,
                       AuditService auditService) {
        this.dealRepository = dealRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Transactional
    public DealResponse createDeal(CreateDealRequest request, UserPrincipal currentUser) {
        UUID buyerId;
        if (currentUser != null) {
            if (currentUser.getRole() == Role.BUYER) {
                buyerId = currentUser.getId();
            } else if (currentUser.getRole() == Role.ADMIN && request.getBuyerId() != null) {
                buyerId = request.getBuyerId();
            } else {
                buyerId = currentUser.getId();
            }
        } else if (request.getBuyerId() != null) {
            buyerId = request.getBuyerId();
        } else {
            throw new BadRequestException("Buyer ID is required to create a deal");
        }

        if (buyerId.equals(request.getSellerId())) {
            throw new BadRequestException("Buyer and Seller cannot be the same account");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("Buyer", "id", buyerId));

        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() -> new ResourceNotFoundException("Seller", "id", request.getSellerId()));

        if (seller.getRole() != Role.SELLER) {
            throw new BadRequestException("Specified seller must have the SELLER role");
        }

        Deal deal = new Deal(
                request.getTitle().trim(),
                request.getDescription() != null ? request.getDescription().trim() : null,
                buyer.getId(),
                seller.getId(),
                request.getTotalAmount(),
                request.getCurrency(),
                DealStatus.DRAFT
        );

        Deal savedDeal = dealRepository.saveAndFlush(deal);

        auditService.logEvent(
                buyerId,
                "DEAL_CREATED",
                "DEAL",
                savedDeal.getId().toString(),
                "Created deal: " + savedDeal.getTitle() + " (" + savedDeal.getTotalAmount() + " " + savedDeal.getCurrency() + ")"
        );

        log.info("Deal created successfully: id={} buyer={} seller={} amount={}",
                savedDeal.getId(), buyerId, seller.getId(), savedDeal.getTotalAmount());

        return DealResponse.fromEntity(savedDeal);
    }

    @Transactional(readOnly = true)
    public DealResponse getDealById(UUID id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deal", "id", id));
        return DealResponse.fromEntity(deal);
    }

    @Transactional(readOnly = true)
    public List<DealResponse> getDealsForBuyer(UUID buyerId) {
        return dealRepository.findByBuyerId(buyerId).stream()
                .map(DealResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DealResponse> getDealsForSeller(UUID sellerId) {
        return dealRepository.findBySellerId(sellerId).stream()
                .map(DealResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
