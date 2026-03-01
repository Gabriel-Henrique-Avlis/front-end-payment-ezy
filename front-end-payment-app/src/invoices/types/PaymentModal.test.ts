import { describe, it, expect } from 'vitest';
import {
    initialPaymentFormData,
    type PaymentResult,
    type PaymentFormData,
    type PaymentModalProps
} from './PaymentModal';

describe('PaymentModal Types', () => {
    describe('initialPaymentFormData', () => {
        it('should have all required form fields', () => {
            expect(initialPaymentFormData).toHaveProperty('email');
            expect(initialPaymentFormData).toHaveProperty('cardNumber');
            expect(initialPaymentFormData).toHaveProperty('expiry');
            expect(initialPaymentFormData).toHaveProperty('cvc');
            expect(initialPaymentFormData).toHaveProperty('name');
            expect(initialPaymentFormData).toHaveProperty('country');
            expect(initialPaymentFormData).toHaveProperty('zip');
        });

        it('should have empty strings for most fields', () => {
            expect(initialPaymentFormData.email).toBe('');
            expect(initialPaymentFormData.cardNumber).toBe('');
            expect(initialPaymentFormData.expiry).toBe('');
            expect(initialPaymentFormData.cvc).toBe('');
            expect(initialPaymentFormData.name).toBe('');
            expect(initialPaymentFormData.zip).toBe('');
        });

        it('should have default country of United States', () => {
            expect(initialPaymentFormData.country).toBe('United States');
        });

        it('should be the correct type', () => {
            const data: PaymentFormData = initialPaymentFormData;
            expect(data).toBeDefined();
        });
    });

    describe('PaymentFormData interface', () => {
        it('should accept valid form data', () => {
            const validData: PaymentFormData = {
                email: 'test@example.com',
                cardNumber: '4111111111111111',
                expiry: '12/25',
                cvc: '123',
                name: 'John Doe',
                country: 'United States',
                zip: '12345',
            };
            expect(validData.email).toBe('test@example.com');
            expect(validData.cardNumber).toBe('4111111111111111');
        });
    });

    describe('PaymentResult interface', () => {
        it('should accept valid payment result', () => {
            const result: PaymentResult = {
                refNumber: 'REF123',
                paymentTime: '2024-01-01 10:00:00',
                amount: 100,
                fee: 2.5,
            };
            expect(result.refNumber).toBe('REF123');
            expect(result.amount).toBe(100);
            expect(result.fee).toBe(2.5);
        });

        it('should have correct property types', () => {
            const result: PaymentResult = {
                refNumber: 'ABC',
                paymentTime: '2024-01-01',
                amount: 50,
                fee: 1,
            };
            expect(typeof result.refNumber).toBe('string');
            expect(typeof result.paymentTime).toBe('string');
            expect(typeof result.amount).toBe('number');
            expect(typeof result.fee).toBe('number');
        });
    });

    describe('PaymentModalProps interface', () => {
        it('should accept valid props with required fields only', () => {
            const props: PaymentModalProps = {
                isOpen: true,
                amount: 100,
                onClose: () => { },
            };
            expect(props.isOpen).toBe(true);
            expect(props.amount).toBe(100);
        });

        it('should accept optional fee and currency', () => {
            const props: PaymentModalProps = {
                isOpen: true,
                amount: 100,
                fee: 2.5,
                currency: 'USD',
                onClose: () => { },
            };
            expect(props.fee).toBe(2.5);
            expect(props.currency).toBe('USD');
        });

        it('should accept optional callbacks', () => {
            const onClose = () => { };
            const onSubmit = () => { };
            const onSuccess = () => { };

            const props: PaymentModalProps = {
                isOpen: true,
                amount: 100,
                onClose,
                onSubmit,
                onSuccess,
            };
            expect(props.onClose).toBe(onClose);
            expect(props.onSubmit).toBe(onSubmit);
            expect(props.onSuccess).toBe(onSuccess);
        });
    });
});
