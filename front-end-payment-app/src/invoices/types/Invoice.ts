export interface Invoice {
    id: string;
    vendor: string;
    amount: number;
    currency: string; // e.g. 'USD'
    issueDate: string; // ISO date
    dueDate: string;   // ISO date
    priority: 'high' | 'normal' | 'urgent' | 'critical';
}
