import type { PaymentFormData, PaymentResult } from '../types/PaymentModal';

export function generateRefNumber(): string {
    // Generate format: REF-YYYYMMDD-XXXX (e.g., REF-20250301-A7F2)
    const now = new Date();
    const date = now.toISOString().split('T')[0].replace(/-/g, '');
    const randomPart = Math.random().toString(16).substring(2, 6).toUpperCase();
    return `REF-${date}-${randomPart}`;
}

export function getPaymentTime(): string {
    // Format: YYYY-MM-DD HH:MM:SS (e.g., 2025-03-01 14:30:45)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function splitCardholderName(fullName: string) {
    const nameParts = fullName.trim().split(/\s+/);

    return {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
    };
}

export function validateCardholderName(fullName: string): boolean {
    const { firstName, lastName } = splitCardholderName(fullName);
    return firstName.length > 0 && lastName.length > 0;
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
    apiResponse: { refNumber?: string; paymentTime?: string },
    amount: number,
    fee: number
): PaymentResult {
    return {
        refNumber: apiResponse.refNumber || generateRefNumber(),
        paymentTime: apiResponse.paymentTime || getPaymentTime(),
        amount,
        fee,
    };
}

export function toSubmitPayload(formData: PaymentFormData, amount: number) {
    return { ...formData, amount };
}
