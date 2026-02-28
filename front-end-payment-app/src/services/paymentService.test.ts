import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPayment, generateIdempotencyKey } from './paymentService';
import api from './api';

// Mock the api module
vi.mock('../api');

describe('PaymentService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('generateIdempotencyKey', () => {
        it('should generate a valid UUID v4 format', () => {
            const key = generateIdempotencyKey();

            // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            expect(key).toMatch(uuidRegex);
        });

        it('should generate unique keys on multiple calls', () => {
            const key1 = generateIdempotencyKey();
            const key2 = generateIdempotencyKey();
            const key3 = generateIdempotencyKey();

            expect(key1).not.toBe(key2);
            expect(key2).not.toBe(key3);
            expect(key1).not.toBe(key3);
        });
    });

    describe('createPayment', () => {
        const mockPaymentData = {
            firstName: 'John',
            lastName: 'Doe',
            cardNumber: '4111111111111111',
            expiry: '12/25',
            cvv: '123',
        };

        const mockIdempotencyKey = 'test-key-123';

        it('should call POST /payments with correct data and headers', async () => {
            const mockResponse = {
                data: {
                    id: '1',
                    refNumber: 'REF123',
                    paymentTime: '2026-02-27T10:00:00Z',
                    amount: 100,
                    fee: 5,
                    status: 'success',
                },
            };

            vi.mocked(api.post).mockResolvedValue(mockResponse);

            await createPayment(mockPaymentData, mockIdempotencyKey);

            expect(api.post).toHaveBeenCalledWith(
                '/payments',
                mockPaymentData,
                {
                    headers: {
                        'Idempotency-Key': mockIdempotencyKey,
                    },
                }
            );
        });

        it('should return payment response on success', async () => {
            const mockResponse = {
                data: {
                    id: '1',
                    refNumber: 'REF123',
                    paymentTime: '2026-02-27T10:00:00Z',
                    amount: 100,
                    fee: 5,
                    status: 'success' as const,
                },
            };

            vi.mocked(api.post).mockResolvedValue(mockResponse);

            const result = await createPayment(mockPaymentData, mockIdempotencyKey);

            expect(result.data).toEqual(mockResponse.data);
            expect(result.data.status).toBe('success');
        });

        it('should propagate API errors', async () => {
            const mockError = new Error('Payment failed');
            vi.mocked(api.post).mockRejectedValue(mockError);

            await expect(
                createPayment(mockPaymentData, mockIdempotencyKey)
            ).rejects.toThrow('Payment failed');
        });

        it('should handle 409 Conflict for duplicate idempotency key', async () => {
            const conflictError = {
                response: {
                    status: 409,
                    data: { message: 'Idempotency key already used with different payload' },
                },
            };

            vi.mocked(api.post).mockRejectedValue(conflictError);

            await expect(
                createPayment(mockPaymentData, mockIdempotencyKey)
            ).rejects.toEqual(conflictError);
        });

        it('should validate that cardNumber is included in request', async () => {
            const mockResponse = { data: { id: '1', refNumber: 'REF123' } };
            vi.mocked(api.post).mockResolvedValue(mockResponse);

            await createPayment(mockPaymentData, mockIdempotencyKey);

            const callArgs = vi.mocked(api.post).mock.calls[0];
            expect(callArgs[1]).toHaveProperty('cardNumber', '4111111111111111');
        });
    });
});
