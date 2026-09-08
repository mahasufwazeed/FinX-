package com.finx.deal.controller;

import com.finx.common.enums.Role;
import com.finx.common.response.ApiResponse;
import com.finx.deal.dto.request.CreateDealRequest;
import com.finx.deal.dto.response.DealResponse;
import com.finx.deal.service.DealService;
import com.finx.security.service.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/deals")
@Tag(name = "Deal Management", description = "Endpoints for initiating and managing B2B fiat escrow deals")
@SecurityRequirement(name = "bearerAuth")
public class DealController {

    private final DealService dealService;

    public DealController(DealService dealService) {
        this.dealService = dealService;
    }

    @PostMapping
    @Operation(summary = "Create a new Deal", description = "Buyer initiates a new B2B fiat deal specifying seller and total amount")
    public ResponseEntity<ApiResponse<DealResponse>> createDeal(
            @Valid @RequestBody CreateDealRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        DealResponse response = dealService.createDeal(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Deal created successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Deal by ID", description = "Fetch deal metadata and terms")
    public ResponseEntity<ApiResponse<DealResponse>> getDealById(@PathVariable UUID id) {
        DealResponse response = dealService.getDealById(id);
        return ResponseEntity.ok(ApiResponse.success("Deal fetched successfully", response));
    }

    @GetMapping
    @Operation(summary = "List My Deals", description = "Fetch all deals associated with the authenticated user")
    public ResponseEntity<ApiResponse<List<DealResponse>>> getMyDeals(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<DealResponse> deals;
        if (currentUser.getRole() == Role.SELLER) {
            deals = dealService.getDealsForSeller(currentUser.getId());
        } else {
            deals = dealService.getDealsForBuyer(currentUser.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Deals retrieved successfully", deals));
    }
}
