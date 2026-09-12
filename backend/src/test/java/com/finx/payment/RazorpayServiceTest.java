package com.finx.payment;

import com.finx.exception.PaymentGatewayUnavailableException;
import com.finx.payment.config.RazorpayProperties;
import com.finx.payment.service.RazorpayService;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RazorpayServiceTest {

    @Test
    void verifiesOnlyTheExactHmacSignature() {
        RazorpayProperties properties = configuredProperties();
        RazorpayService service = new RazorpayService(properties);
        String orderId = "order_test_123";
        String paymentId = "pay_test_456";

        assertThat(service.verifyPaymentSignature(
                orderId,
                paymentId,
                service.generateTestSignature(orderId, paymentId)
        )).isTrue();
        assertThat(service.verifyPaymentSignature(orderId, paymentId, "test_signature")).isFalse();
        assertThat(service.verifyPaymentSignature(orderId, paymentId, "sig_test_anything")).isFalse();
    }

    @Test
    void rejectsVerificationWithoutConfiguredRazorpayCredentials() {
        RazorpayService service = new RazorpayService(new RazorpayProperties());

        assertThatThrownBy(() -> service.verifyPaymentSignature("order_test_123", "pay_test_456", "signature"))
                .isInstanceOf(PaymentGatewayUnavailableException.class);
    }

    @Test
    void verifiesWebhookOnlyWithTheDedicatedWebhookSecret() {
        RazorpayProperties properties = configuredProperties();
        RazorpayService service = new RazorpayService(properties);
        String payload = "{\"event\":\"payment.captured\"}";

        assertThat(service.verifyWebhookSignature(
                payload,
                service.calculateHmacSha256(payload, properties.getWebhookSecret())
        )).isTrue();
        assertThat(service.verifyWebhookSignature(payload, "test_webhook_signature")).isFalse();
    }

    private RazorpayProperties configuredProperties() {
        RazorpayProperties properties = new RazorpayProperties();
        properties.setKeyId("rzp_test_fixture");
        properties.setKeySecret("test_payment_hmac_secret");
        properties.setWebhookSecret("test_webhook_hmac_secret");
        properties.setSandboxMode(true);
        return properties;
    }
}
