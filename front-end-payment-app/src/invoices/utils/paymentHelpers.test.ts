import { describe, it, expect } from 'vitest';
import type { PaymentFormData } from '../types/PaymentModal';
import {
    splitCardholderName,
    validateCardholderName,
    sanitizeCardNumber,
    maskCardNumber,
    maskExpiry,
    maskCvc,
    maskZip,
    formatCurrency,
    buildPaymentResult,
    toSubmitPayload,
    generateRefNumber,
    getPaymentTime,
} from './paymentHelpers';

describe('paymentHelpers', () => {
    describe('splitCardholderName', () => {
        it('should split full name into first and last name', () => {
            const result = splitCardholderName('John Doe');
            expect(result).toEqual({
                firstName: 'John',
                lastName: 'Doe',
            });
        });

        it('should handle single name', () => {
            const result = splitCardholderName('John');
            expect(result).toEqual({
                firstName: 'John',
                lastName: '',
            });
        });

        it('should handle multiple last names', () => {
            const result = splitCardholderName('John Paul Smith');
            expect(result).toEqual({
                firstName: 'John',
                lastName: 'Paul Smith',
            });
        });

        it('should trim whitespace', () => {
            const result = splitCardholderName('  John  Doe  ');
            expect(result).toEqual({
                firstName: 'John',
                lastName: 'Doe',
            });
        });

        it('should handle empty string', () => {
            const result = splitCardholderName('');
            expect(result).toEqual({
                firstName: '',
                lastName: '',
            });
        });
    });

    describe('validateCardholderName', () => {
        it('should return true for valid full name', () => {
            const result = validateCardholderName('John Doe');
            expect(result).toBe(true);
        });

        it('should return true for multiple last names', () => {
            const result = validateCardholderName('John Paul Smith');
            expect(result).toBe(true);
        });

        it('should return true for names with extra whitespace', () => {
            const result = validateCardholderName('  John  Doe  ');
            expect(result).toBe(true);
        });

        it('should return false for single name only', () => {
            const result = validateCardholderName('John');
            expect(result).toBe(false);
        });

        it('should return false for empty string', () => {
            const result = validateCardholderName('');
            expect(result).toBe(false);
        });

        it('should return false for whitespace only', () => {
            const result = validateCardholderName('   ');
            expect(result).toBe(false);
        });
    });

    describe('sanitizeCardNumber', () => {
        it('should remove spaces from card number', () => {
            const result = sanitizeCardNumber('4111 1111 1111 1111');
            expect(result).toBe('4111111111111111');
        });

        it('should remove all whitespace characters', () => {
            const result = sanitizeCardNumber('4111\t1111\n1111\r1111');
            expect(result).toBe('4111111111111111');
        });

        it('should leave clean card numbers unchanged', () => {
            const result = sanitizeCardNumber('4111111111111111');
            expect(result).toBe('4111111111111111');
        });
    });

    describe('maskCardNumber', () => {
        it('should format card number with spaces', () => {
            const result = maskCardNumber('4111111111111111');
            expect(result).toBe('4111 1111 1111 1111');
        });

        it('should limit to 16 digits', () => {
            const result = maskCardNumber('41111111111111111111');
            expect(result).toBe('4111 1111 1111 1111');
        });

        it('should handle partial input', () => {
            const result = maskCardNumber('4111');
            expect(result).toBe('4111');
        });

        it('should remove non-digit characters', () => {
            const result = maskCardNumber('4111-1111-1111-1111');
            expect(result).toBe('4111 1111 1111 1111');
        });
    });

    describe('maskExpiry', () => {
        it('should format expiry as MM/YY', () => {
            const result = maskExpiry('1225');
            expect(result).toBe('12/25');
        });

        it('should limit to 4 digits', () => {
            const result = maskExpiry('123456');
            expect(result).toBe('12/34');
        });

        it('should handle partial input without slash', () => {
            const result = maskExpiry('12');
            expect(result).toBe('12');
        });

        it('should remove non-digit characters', () => {
            const result = maskExpiry('12-25');
            expect(result).toBe('12/25');
        });
    });

    describe('maskCvc', () => {
        it('should allow up to 3 digits for CVC', () => {
            const result = maskCvc('123');
            expect(result).toBe('123');
        });

        it('should limit to 3 digits', () => {
            const result = maskCvc('12345');
            expect(result).toBe('123');
        });

        it('should remove non-digit characters', () => {
            const result = maskCvc('1-2-3');
            expect(result).toBe('123');
        });
    });

    describe('maskZip', () => {
        it('should format zip code in uppercase', () => {
            const result = maskZip('a1b2c3');
            expect(result).toBe('A1B2C3');
        });

        it('should allow alphanumeric and hyphen', () => {
            const result = maskZip('A1B-2C3');
            expect(result).toBe('A1B-2C3');
        });

        it('should remove special characters', () => {
            const result = maskZip('A1B@2C#3');
            expect(result).toBe('A1B2C3');
        });

        it('should limit to 12 characters', () => {
            const result = maskZip('ABC1234567890DEF');
            expect(result).toBe('ABC123456789');
        });

        it('should preserve spaces', () => {
            const result = maskZip('A1B 2C3');
            expect(result).toBe('A1B 2C3');
        });
    });

    describe('formatCurrency', () => {
        it('should format USD currency', () => {
            const result = formatCurrency(100, 'USD');
            expect(result).toMatch(/\$|USD/);
            expect(result).toMatch(/100/);
        });

        it('should format EUR currency', () => {
            const result = formatCurrency(100, 'EUR');
            expect(result).toMatch(/€|EUR/);
            expect(result).toMatch(/100/);
        });

        it('should format decimal amounts with locale-appropriate separator', () => {
            const result = formatCurrency(99.99, 'USD');
            // The result will have 99 and 99 separated by either . or , depending on locale
            expect(result).toMatch(/99/);
        });
    });

    describe('generateRefNumber', () => {
        it('should generate a ref number with correct format', () => {
            const refNumber = generateRefNumber();
            expect(refNumber).toMatch(/^REF-\d{8}-[A-F0-9]{4}$/);
        });

        it('should generate unique ref numbers', () => {
            const ref1 = generateRefNumber();
            const ref2 = generateRefNumber();
            expect(ref1).not.toBe(ref2);
        });

        it('should contain today\'s date', () => {
            const refNumber = generateRefNumber();
            const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
            expect(refNumber).toContain(today);
        });
    });

    describe('getPaymentTime', () => {
        it('should generate payment time with correct format', () => {
            const paymentTime = getPaymentTime();
            expect(paymentTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        it('should contain current date', () => {
            const paymentTime = getPaymentTime();
            const today = new Date().toISOString().split('T')[0];
            expect(paymentTime).toContain(today);
        });

        it('should have valid time format', () => {
            const paymentTime = getPaymentTime();
            const [date, time] = paymentTime.split(' ');
            const [hours, minutes, seconds] = time.split(':');

            expect(parseInt(hours)).toBeLessThanOrEqual(23);
            expect(parseInt(minutes)).toBeLessThanOrEqual(59);
            expect(parseInt(seconds)).toBeLessThanOrEqual(59);
        });
    });

    describe('buildPaymentResult', () => {
        it('should build payment result from API response', () => {
            const apiResponse = {
                refNumber: 'REF123',
                paymentTime: '2026-02-27 10:00:00',
            };
            const result = buildPaymentResult(apiResponse, 100, 5);

            expect(result).toEqual({
                refNumber: 'REF123',
                paymentTime: '2026-02-27 10:00:00',
                amount: 100,
                fee: 5,
            });
        });

        it('should generate ref number if not provided in API response', () => {
            const apiResponse = {
                paymentTime: '2026-02-27 10:00:00',
            };
            const result = buildPaymentResult(apiResponse, 100, 5);

            expect(result.refNumber).toMatch(/^REF-\d{8}-[A-F0-9]{4}$/);
            expect(result.paymentTime).toBe('2026-02-27 10:00:00');
            expect(result.amount).toBe(100);
        });

        it('should generate payment time if not provided in API response', () => {
            const apiResponse = {
                refNumber: 'REF123',
            };
            const result = buildPaymentResult(apiResponse, 100, 5);

            expect(result.refNumber).toBe('REF123');
            expect(result.paymentTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
            expect(result.amount).toBe(100);
        });

        it('should generate both ref number and payment time if API response is empty', () => {
            const apiResponse = {};
            const result = buildPaymentResult(apiResponse, 100, 5);

            expect(result.refNumber).toMatch(/^REF-\d{8}-[A-F0-9]{4}$/);
            expect(result.paymentTime).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
            expect(result.amount).toBe(100);
            expect(result.fee).toBe(5);
        });

        it('should handle different amounts and fees', () => {
            const apiResponse = {
                refNumber: 'REF456',
                paymentTime: '2026-02-28 15:30:00',
            };
            const result = buildPaymentResult(apiResponse, 250.75, 12.5);

            expect(result.amount).toBe(250.75);
            expect(result.fee).toBe(12.5);
        });
    });

    describe('toSubmitPayload', () => {
        it('should build submit payload with amount', () => {
            const formData: PaymentFormData = {
                email: 'john@example.com',
                cardNumber: '4111111111111111',
                expiry: '12/25',
                cvc: '123',
                name: 'John Doe',
                country: 'United States',
                zip: '12345',
            };
            const result = toSubmitPayload(formData, 100);

            expect(result).toEqual({
                ...formData,
                amount: 100,
            });
        });

        it('should not modify original form data', () => {
            const formData: PaymentFormData = {
                email: 'jane@example.com',
                cardNumber: '5555555555554444',
                expiry: '11/24',
                cvc: '456',
                name: 'Jane Smith',
                country: 'Canada',
                zip: '54321',
            };
            const result = toSubmitPayload(formData, 50);

            expect(formData).not.toHaveProperty('amount');
            expect(result).toHaveProperty('amount', 50);
        });
    });
});
