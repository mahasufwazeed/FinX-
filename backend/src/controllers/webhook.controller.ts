import { Request, Response } from 'express';

// The Node/Prisma implementation is retired. Never acknowledge or process a
// payment webhook through a backend that is not the authoritative ledger.
export const handleRazorpayWebhook = (_req: Request, res: Response): void => {
    res.status(410).json({
        message: 'The legacy Node/Prisma backend is disabled. Razorpay webhooks must target the Spring Boot backend.'
    });
};
