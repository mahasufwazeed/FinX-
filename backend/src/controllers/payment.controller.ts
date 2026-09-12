import { Request, Response } from 'express';

const legacyBackendDisabled = (_req: Request, res: Response): void => {
    res.status(410).json({
        message: 'The legacy Node/Prisma backend is disabled. Run the Spring Boot backend for FINX APIs.'
    });
};

// This implementation was not the deployed backend and had independent,
// unsafe payment behavior. Keep its routes fail-closed until it is removed.
export const createPaymentOrder = legacyBackendDisabled;
export const verifyPayment = legacyBackendDisabled;
export const getPaymentById = legacyBackendDisabled;
export const getBuyerPayments = legacyBackendDisabled;
