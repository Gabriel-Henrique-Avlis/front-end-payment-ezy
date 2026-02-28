export interface PaymentResult {
    refNumber: string;
    paymentTime: string;
    amount: number;
    fee: number;
}

export interface PaymentFormData {
    email: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
    name: string;
    country: string;
    zip: string;
}

export const initialPaymentFormData: PaymentFormData = {
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    country: 'United States',
    zip: '',
};

export interface PaymentModalProps {
    isOpen: boolean;
    amount: number;
    fee?: number;
    currency?: string;
    onClose: () => void;
    onSubmit?: (data: PaymentFormData & { amount: number }) => void;
    onSuccess?: (result: PaymentResult) => void;
}
