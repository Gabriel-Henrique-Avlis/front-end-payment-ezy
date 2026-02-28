import type { Invoice } from '../types/Invoice';
import api from '../../services/api';

// types matching the shape returned by the backend
export interface InvoicesResponse {
    invoices: Invoice[];
    totalAmount: number;
    lastUpdated: string;
}

export function getInvoices() {
    return api.get<InvoicesResponse>('/invoices');
}

export function getInvoice(id: string) {
    return api.get<Invoice>(`/invoices/${id}`);
}

export function createInvoice(data: Invoice) {
    return api.post<Invoice>('/invoices', data);
}

export function updateInvoice(id: string, data: Partial<Invoice>) {
    return api.patch<Invoice>(`/invoices/${id}`, data);
}

export function deleteInvoice(id: string) {
    return api.delete<void>(`/invoices/${id}`);
}
