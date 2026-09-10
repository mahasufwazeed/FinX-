/**
 * FINX End-to-End MVP Integration Test Suite
 * Tests complete lifecycle against backend (http://localhost:8080) and frontend (http://localhost:3000)
 */

const BACKEND_URL = 'http://localhost:8080/api';
const FRONTEND_URL = 'http://localhost:3000';

async function request(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };
    const res = await fetch(url, {
        ...options,
        headers
    });
    const text = await res.text();
    let json;
    try {
        json = JSON.parse(text);
    } catch {
        json = null;
    }
    return { status: res.status, ok: res.ok, data: json, text };
}

async function runTests() {
    console.log('====================================================');
    console.log('   FINX End-to-End MVP Integration Verification     ');
    console.log('====================================================\n');

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
        if (condition) {
            console.log(`\x1b[32m[PASS]\x1b[0m ${message}`);
            passed++;
        } else {
            console.error(`\x1b[31m[FAIL]\x1b[0m ${message}`);
            failed++;
        }
    }

    try {
        // 1. Google OAuth Config Security
        console.log('--- Phase 1: Google OAuth Security & Config ---');
        const googleConfigRes = await request(`${BACKEND_URL}/auth/google/config`);
        assert(googleConfigRes.ok, 'Google OAuth config endpoint responds 200 OK');
        assert(googleConfigRes.data?.data?.clientId?.length > 0, 'Google client ID is returned');
        assert(!googleConfigRes.text.includes('GOCSPX'), 'Google client secret is NEVER exposed to client');

        // 2. Test Invalid Login
        console.log('\n--- Phase 2: Invalid Login Handling ---');
        const invalidLoginRes = await request(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: 'nonexistent@finx.com',
                password: 'WrongPassword123!'
            })
        });
        assert(invalidLoginRes.status === 401, `Invalid login returns HTTP 401 (got ${invalidLoginRes.status})`);

        // 3. Register Corporate User (BUYER)
        console.log('\n--- Phase 3: Corporate User Registration ---');
        const corporateEmail = `corporate.${Date.now()}@finx.com`;
        const corpRegRes = await request(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'Acme Corp Executive',
                email: corporateEmail,
                password: 'Password123!',
                role: 'BUYER'
            })
        });
        assert(corpRegRes.ok, `Corporate registration returns 200/201 (got ${corpRegRes.status})`);
        const corpTokens = corpRegRes.data?.data;
        assert(corpTokens?.accessToken && corpTokens?.refreshToken, 'Access token and refresh token issued');
        const corporateUser = corpTokens?.user;
        assert(corporateUser?.role === 'BUYER', `Corporate role is BUYER (got ${corporateUser?.role})`);
        assert(corporateUser?.name === 'Acme Corp Executive', `Corporate user name matches (got ${corporateUser?.name})`);

        // 4. Register Vendor User (SELLER)
        console.log('\n--- Phase 4: Vendor User Registration ---');
        const vendorEmail = `vendor.${Date.now()}@finx.com`;
        const vendorRegRes = await request(`${BACKEND_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({
                name: 'Apex Solutions Vendor',
                email: vendorEmail,
                password: 'Password123!',
                role: 'SELLER'
            })
        });
        assert(vendorRegRes.ok, `Vendor registration returns 200/201 (got ${vendorRegRes.status})`);
        const vendorTokens = vendorRegRes.data?.data;
        assert(vendorTokens?.accessToken && vendorTokens?.refreshToken, 'Vendor access token and refresh token issued');
        const vendorUser = vendorTokens?.user;
        assert(vendorUser?.role === 'SELLER', `Vendor role is SELLER (got ${vendorUser?.role})`);

        // 5. Test Login & /api/auth/me Session Hydration
        console.log('\n--- Phase 5: Authentication & Session Hydration (/api/auth/me) ---');
        const corpLoginRes = await request(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: corporateEmail,
                password: 'Password123!'
            })
        });
        assert(corpLoginRes.ok, 'Corporate login successful');
        const activeCorpToken = corpLoginRes.data?.data?.accessToken;

        const corpMeRes = await request(`${BACKEND_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${activeCorpToken}` }
        });
        assert(corpMeRes.ok, 'Session hydration /api/auth/me returns 200 OK');
        assert(corpMeRes.data?.data?.email === corporateEmail, 'Hydrated user email matches');

        // 6. Test Refresh Token
        console.log('\n--- Phase 6: Refresh Token Rotation ---');
        const refreshRes = await request(`${BACKEND_URL}/auth/refresh`, {
            method: 'POST',
            body: JSON.stringify({
                refreshToken: corpLoginRes.data?.data?.refreshToken
            })
        });
        assert(refreshRes.ok, 'Token refresh returns 200 OK');
        assert(refreshRes.data?.data?.accessToken?.length > 0, 'New access token issued');

        // 7. Get Available Sellers Dropdown
        console.log('\n--- Phase 7: Fetch Sellers for Deal Creation ---');
        const sellersRes = await request(`${BACKEND_URL}/deals/sellers`, {
            headers: { Authorization: `Bearer ${activeCorpToken}` }
        });
        assert(sellersRes.ok, 'GET /api/deals/sellers returns 200 OK');
        const sellers = sellersRes.data?.data || [];
        const foundSeller = sellers.find(s => s.id === vendorUser.id || s.email === vendorEmail);
        assert(foundSeller !== undefined, `Registered vendor found in seller dropdown list (${foundSeller?.name})`);

        // 8. Corporate Creates Deal
        console.log('\n--- Phase 8: Corporate Creates Deal ---');
        const createDealRes = await request(`${BACKEND_URL}/deals`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${activeCorpToken}` },
            body: JSON.stringify({
                title: 'Enterprise Cloud Migration & Kubernetes Setup',
                description: 'End-to-end migration of core databases and container clusters.',
                sellerId: vendorUser.id,
                totalAmount: 15000,
                currency: 'USD'
            })
        });
        assert(createDealRes.ok, `Deal created successfully (got ${createDealRes.status})`);
        const deal = createDealRes.data?.data;
        assert(deal?.id !== undefined, `Deal assigned valid ID: ${deal?.id}`);
        assert(deal?.status === 'DRAFT' || deal?.status === 'PENDING_ACCEPTANCE', `Initial deal status is DRAFT/PENDING_ACCEPTANCE (got ${deal?.status})`);
        assert(Number(deal?.totalAmount) === 15000, `Deal total amount is 15000 (got ${deal?.totalAmount})`);
        assert(deal?.buyerId === corporateUser.id, `Deal buyer matches Corporate ID`);
        assert(deal?.sellerId === vendorUser.id, `Deal seller matches Vendor ID`);

        // 9. Fetch Deal Details by ID & Deal Listing
        console.log('\n--- Phase 9: Fetch Deal Details & Deal Listing ---');
        const getDealRes = await request(`${BACKEND_URL}/deals/${deal.id}`, {
            headers: { Authorization: `Bearer ${activeCorpToken}` }
        });
        assert(getDealRes.ok, 'GET /api/deals/{id} returns 200 OK');
        assert(getDealRes.data?.data?.title === 'Enterprise Cloud Migration & Kubernetes Setup', 'Deal title matches');

        const listDealsRes = await request(`${BACKEND_URL}/deals`, {
            headers: { Authorization: `Bearer ${activeCorpToken}` }
        });
        assert(listDealsRes.ok, 'GET /api/deals returns 200 OK');
        const corpDeals = listDealsRes.data?.data?.content || listDealsRes.data?.data || [];
        assert(corpDeals.some(d => d.id === deal.id), 'Created deal is present in corporate deals list');

        // 10. Vendor Views Deal & Accepts Deal
        console.log('\n--- Phase 10: Vendor Views & Accepts Deal ---');
        const vendorLoginRes = await request(`${BACKEND_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                email: vendorEmail,
                password: 'Password123!'
            })
        });
        const activeVendorToken = vendorLoginRes.data?.data?.accessToken;

        const vendorDealsRes = await request(`${BACKEND_URL}/deals`, {
            headers: { Authorization: `Bearer ${activeVendorToken}` }
        });
        assert(vendorDealsRes.ok, 'Vendor GET /api/deals returns 200 OK');
        const vendorDeals = vendorDealsRes.data?.data?.content || vendorDealsRes.data?.data || [];
        assert(vendorDeals.some(d => d.id === deal.id), 'Assigned deal is visible in vendor deals list');

        const acceptDealRes = await request(`${BACKEND_URL}/deals/${deal.id}/accept`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${activeVendorToken}` }
        });
        assert(acceptDealRes.ok, `Vendor accepted deal returns 200 OK (got ${acceptDealRes.status})`);
        const acceptedDeal = acceptDealRes.data?.data;
        assert(acceptedDeal?.status === 'ACTIVE', `Deal status successfully transitioned to ACTIVE (got ${acceptedDeal?.status})`);

        // 11. Test Cancel Deal Lifecycle
        console.log('\n--- Phase 11: Deal Cancellation Flow ---');
        const dealToCancelRes = await request(`${BACKEND_URL}/deals`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${activeCorpToken}` },
            body: JSON.stringify({
                title: 'Deal To Cancel',
                description: 'Testing cancellation flow',
                sellerId: vendorUser.id,
                totalAmount: 5000,
                currency: 'USD'
            })
        });
        const cancelDealId = dealToCancelRes.data?.data?.id;
        const cancelRes = await request(`${BACKEND_URL}/deals/${cancelDealId}/cancel`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${activeCorpToken}` }
        });
        assert(cancelRes.ok, 'Cancel deal returns 200 OK');
        assert(cancelRes.data?.data?.status === 'CANCELLED', `Cancelled deal status is CANCELLED (got ${cancelRes.data?.data?.status})`);

        // 12. Frontend Route Integrity Check
        console.log('\n--- Phase 12: Frontend Route Integrity (No 404s, No Under Construction) ---');
        const frontendRoutes = [
            '/',
            '/login',
            '/register',
            '/corporate',
            '/corporate/projects',
            `/corporate/projects/${deal.id}`,
            '/corporate/milestones',
            '/corporate/payments',
            '/corporate/escrow',
            '/corporate/settings',
            '/vendor',
            '/vendor/projects',
            `/vendor/projects/${deal.id}`,
            '/vendor/milestones',
            '/vendor/deliverables',
            '/vendor/payments',
            '/vendor/escrow',
            '/vendor/settings',
            '/admin',
            '/admin/users',
            '/admin/audit-logs'
        ];

        for (const route of frontendRoutes) {
            const res = await fetch(`${FRONTEND_URL}${route}`);
            assert(res.status === 200, `Frontend route ${route} returns HTTP 200`);
            const html = await res.text();
            assert(!html.includes('Under Construction'), `Route ${route} has NO "Under Construction" placeholder`);
        }

        console.log('\n====================================================');
        console.log(`   Verification Summary: ${passed} PASSED, ${failed} FAILED`);
        console.log('====================================================\n');

        if (failed > 0) {
            process.exit(1);
        }
    } catch (err) {
        console.error('Fatal test execution error:', err);
        process.exit(1);
    }
}

runTests();
