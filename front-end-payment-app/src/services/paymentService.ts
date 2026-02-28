import api from './api';

export interface PaymentRequest {
    firstName: string;
    lastName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
}

export interface PaymentResponse {
    id: string;
    refNumber: string;
    paymentTime: string;
    amount: number;
    fee: number;
    status: 'success' | 'failed';
}

/**
 * Generates a unique idempotency key for payment requests.
 * In a production app, you might store this per-transaction
 * or generate it based on cart/invoice IDs.
 */
export function generateIdempotencyKey(): string {
    // Use browser's native crypto API (available in all modern browsers)
    return crypto.randomUUID();
}

/**
 * Creates a payment by calling POST /payments with idempotency support.
 * 
 * @param paymentData - Payment details (firstName, lastName, cardNumber, expiry, cvv)
 * @param idempotencyKey - Unique key to prevent duplicate payments
 * @returns Promise resolving to the payment response
 */
export function createPayment(
    paymentData: PaymentRequest,
    idempotencyKey: string
) {
    return api.post<PaymentResponse>('/payments', paymentData, {
        headers: {
            'Idempotency-Key': idempotencyKey,
        },
    });
}
