import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getApiErrorMessage } from './errorHandler';

vi.mock('axios');

describe('errorHandler', () => {
    describe('getApiErrorMessage', () => {
        beforeEach(() => {
            vi.clearAllMocks();
        });

        it('should return fallback message for non-axios errors', () => {
            const error = new Error('Some error');
            const result = getApiErrorMessage(error);
            expect(result).toBe('Payment failed. Please check your card details and try again.');
        });

        it('should return custom fallback for non-axios errors', () => {
            const error = new Error('Some error');
            const customFallback = 'Custom error message';
            const result = getApiErrorMessage(error, customFallback);
            expect(result).toBe(customFallback);
        });

        it('should return 409 conflict message for duplicate payment', () => {
            const error = {
                response: { status: 409 },
            };
            vi.mocked(axios.isAxiosError).mockReturnValue(true);

            const result = getApiErrorMessage(error);
            expect(result).toBe('Duplicate payment detected. This transaction has already been processed.');
        });

        it('should return error message from API response', () => {
            const error = {
                response: {
                    status: 400,
                    data: { message: 'Invalid card number' },
                },
            };
            vi.mocked(axios.isAxiosError).mockReturnValue(true);

            const result = getApiErrorMessage(error);
            expect(result).toBe('Invalid card number');
        });

        it('should return message from API response even with whitespace', () => {
            const error = {
                response: {
                    status: 400,
                    data: { message: '  Card expired  ' },
                },
            };
            vi.mocked(axios.isAxiosError).mockReturnValue(true);

            const result = getApiErrorMessage(error);
            // Message is returned as-is from API response
            expect(result).toBe('  Card expired  ');
        });

        it('should return fallback for empty API error message', () => {
            const error = {
                response: {
                    status: 400,
                    data: { message: '   ' },
                },
            };
            vi.mocked(axios.isAxiosError).mockReturnValue(true);

            const result = getApiErrorMessage(error);
            expect(result).toBe('Payment failed. Please check your card details and try again.');
        });

        it('should return network error message when no response', () => {
            const error = {
                response: undefined,
            };
            vi.mocked(axios.isAxiosError).mockReturnValue(true);

            const result = getApiErrorMessage(error);
            expect(result).toBe('Unable to reach payment API. Please try again.');
        });

        it('should return fallback for missing message in response data', () => {
            const error = {
                response: {
                    status: 500,
                    data: {},
                },
            };
            vi.mocked(axios.isAxiosError).mockReturnValue(true);

            const result = getApiErrorMessage(error);
            expect(result).toBe('Payment failed. Please check your card details and try again.');
        });

        it('should handle non-string message in response', () => {
            const error = {
                response: {
                    status: 400,
                    data: { message: 123 },
                },
            };
            vi.mocked(axios.isAxiosError).mockReturnValue(true);

            const result = getApiErrorMessage(error);
            expect(result).toBe('Payment failed. Please check your card details and try again.');
        });

        it('should handle error object with undefined response gracefully', () => {
            const error = {};
            vi.mocked(axios.isAxiosError).mockReturnValue(true);

            const result = getApiErrorMessage(error);
            expect(result).toBe('Unable to reach payment API. Please try again.');
        });
    });
});
