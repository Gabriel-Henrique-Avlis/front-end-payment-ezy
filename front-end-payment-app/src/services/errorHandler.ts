import axios from 'axios';

interface ApiErrorPayload {
    message?: string;
}

export function getApiErrorMessage(
    error: unknown,
    fallback = 'Payment failed. Please check your card details and try again.'
): string {
    if (!axios.isAxiosError(error)) {
        return fallback;
    }

    if (error.response?.status === 409) {
        return 'Duplicate payment detected. This transaction has already been processed.';
    }

    const payload = error.response?.data as ApiErrorPayload | undefined;
    if (typeof payload?.message === 'string' && payload.message.trim()) {
        return payload.message;
    }

    if (!error.response) {
        return 'Unable to reach payment API. Please try again.';
    }

    return fallback;
}
