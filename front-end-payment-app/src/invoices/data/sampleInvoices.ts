import type { Invoice } from '../types/Invoice';

// mimic API response shape
export const sampleData = {
    invoices: [
        {
            id: 'INV-2025-002',
            vendor: 'Tech Solutions Inc.',
            amount: 2850.0,
            currency: 'USD',
            issueDate: '2025-02-20',
            dueDate: '2025-03-20',
            priority: 'high' as const,
        },
        {
            id: 'INV-2025-003',
            vendor: 'Marketing Partners LLC',
            amount: 4500.0,
            currency: 'USD',
            issueDate: '2025-02-28',
            dueDate: '2025-03-30',
            priority: 'normal' as const,
        },
        {
            id: 'INV-2025-004',
            vendor: 'Utility Services',
            amount: 520.45,
            currency: 'USD',
            issueDate: '2025-03-01',
            dueDate: '2025-03-15',
            priority: 'urgent' as const,
        },
        {
            id: 'INV-2025-007',
            vendor: 'Server Hosting Pro',
            amount: 899.99,
            currency: 'USD',
            issueDate: '2025-03-08',
            dueDate: '2025-03-22',
            priority: 'high' as const,
        },
        {
            id: 'INV-2025-008',
            vendor: 'Office Rent LLC',
            amount: 5000.0,
            currency: 'USD',
            issueDate: '2025-03-01',
            dueDate: '2025-03-10',
            priority: 'critical' as const,
        },
    ] as Invoice[],
    totalAmount: 13770.44,
    lastUpdated: '2025-03-24T14:15:00Z',
};
