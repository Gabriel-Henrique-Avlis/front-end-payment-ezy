import { describe, it, expect } from 'vitest';
import type { Invoice } from './Invoice';
import type { InvoicesTableProps } from './InvoicesTable';
import type { InvoiceRow } from './InvoiceRow';
import type { InvoiceSortKey } from './InvoiceSortKey';

describe('Invoice Types', () => {
    describe('Invoice', () => {
        it('should accept valid invoice data', () => {
            const invoice: Invoice = {
                id: 'INV-001',
                vendor: 'ACME Corp',
                amount: 1500.50,
                currency: 'USD',
                issueDate: '2024-01-15',
                dueDate: '2024-02-15',
                priority: 'high',
            };
            expect(invoice.id).toBe('INV-001');
            expect(invoice.vendor).toBe('ACME Corp');
            expect(invoice.amount).toBe(1500.50);
            expect(invoice.currency).toBe('USD');
            expect(invoice.priority).toBe('high');
        });

        it('should have all required properties', () => {
            const invoice: Invoice = {
                id: 'INV-002',
                vendor: 'Tech Solutions',
                amount: 2000,
                currency: 'EUR',
                issueDate: '2024-01-01',
                dueDate: '2024-02-01',
                priority: 'normal',
            };
            expect(invoice).toHaveProperty('id');
            expect(invoice).toHaveProperty('vendor');
            expect(invoice).toHaveProperty('amount');
            expect(invoice).toHaveProperty('currency');
            expect(invoice).toHaveProperty('issueDate');
            expect(invoice).toHaveProperty('dueDate');
            expect(invoice).toHaveProperty('priority');
        });

        it('should accept valid priority values', () => {
            const priorities: Array<'high' | 'normal' | 'urgent' | 'critical'> = ['high', 'normal', 'urgent', 'critical'];

            priorities.forEach(priority => {
                const invoice: Invoice = {
                    id: 'INV-003',
                    vendor: 'Company',
                    amount: 100,
                    currency: 'USD',
                    issueDate: '2024-01-01',
                    dueDate: '2024-02-01',
                    priority,
                };
                expect(invoice.priority).toBe(priority);
            });
        });
    });

    describe('InvoicesTableProps', () => {
        it('should accept valid props with invoices array', () => {
            const props: InvoicesTableProps = {
                invoices: [] as Invoice[],
                selectedIds: [],
                onToggle: () => { },
            };
            expect(props.invoices).toBeDefined();
            expect(Array.isArray(props.invoices)).toBe(true);
            expect(Array.isArray(props.selectedIds)).toBe(true);
        });

        it('should accept multiple selected invoice IDs', () => {
            const props: InvoicesTableProps = {
                invoices: [] as Invoice[],
                selectedIds: ['INV-001', 'INV-002', 'INV-003'],
                onToggle: () => { },
            };
            expect(props.selectedIds).toHaveLength(3);
            expect(props.selectedIds).toContain('INV-001');
        });

        it('should have onToggle callback', () => {
            const mockOnToggle = (id: string) => id.toUpperCase();
            const props: InvoicesTableProps = {
                invoices: [] as Invoice[],
                selectedIds: [],
                onToggle: mockOnToggle,
            };
            expect(props.onToggle('inv-001')).toBe('INV-001');
        });
    });

    describe('InvoiceRow', () => {
        it('should have correct row structure', () => {
            const row: InvoiceRow = {
                id: 'ROW-001',
                isSelected: false,
                amount: 500,
                vendor: 'Vendor A',
                dueDate: '2024-02-01',
                priority: 'normal',
            };
            expect(row.id).toBe('ROW-001');
            expect(row.isSelected).toBe(false);
            expect(row.vendor).toBe('Vendor A');
        });

        it('should support selection state', () => {
            const selectedRow: InvoiceRow = {
                id: 'ROW-002',
                isSelected: true,
                amount: 1000,
                vendor: 'Vendor B',
                dueDate: '2024-02-01',
                priority: 'urgent',
            };
            expect(selectedRow.isSelected).toBe(true);
        });
    });

    describe('InvoiceSortKey', () => {
        it('should have valid sort keys', () => {
            const sortKeys: InvoiceSortKey[] = [
                'amount',
                'vendor',
                'dueDate',
                'priority',
            ];
            sortKeys.forEach(key => {
                expect(typeof key).toBe('string');
                expect(key.length).toBeGreaterThan(0);
            });
        });
    });
});
