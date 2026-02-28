import type { PaymentFormData, PaymentResult } from '../types/PaymentModal';

export function splitCardholderName(fullName: string) {
    const nameParts = fullName.trim().split(/\s+/);

    return {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
    };
}

export function sanitizeCardNumber(cardNumber: string) {
    return cardNumber.replace(/\s+/g, '');
}

export function formatCurrency(value: number, currency: string) {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(value);
}

export function buildPaymentResult(
    apiResponse: { refNumber: string; paymentTime: string },
    amount: number,
    fee: number
): PaymentResult {
    return {
        refNumber: apiResponse.refNumber,
        paymentTime: apiResponse.paymentTime,
        amount,
        fee,
    };
}

export function toSubmitPayload(formData: PaymentFormData, amount: number) {
    return { ...formData, amount };
}
