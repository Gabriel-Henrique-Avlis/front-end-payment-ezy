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

export function maskCardNumber(value: string) {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 16);
    return digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function maskExpiry(value: string) {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);

    if (digitsOnly.length <= 2) {
        return digitsOnly;
    }

    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
}

export function maskCvc(value: string) {
    return value.replace(/\D/g, '').slice(0, 3);
}

export function maskZip(value: string) {
    return value.replace(/[^a-zA-Z0-9\-\s]/g, '').slice(0, 12).toUpperCase();
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
