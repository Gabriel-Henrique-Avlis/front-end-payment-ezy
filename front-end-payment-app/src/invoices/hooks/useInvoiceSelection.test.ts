import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInvoiceSelection } from './useInvoiceSelection';
import type { Invoice } from '../types/Invoice';

describe('useInvoiceSelection', () => {
    const mockInvoices: Invoice[] = [
        {
            id: 'INV-001',
            vendor: 'Vendor A',
            amount: 100,
            currency: 'USD',
            issueDate: '2025-01-15',
            dueDate: '2025-02-15',
            priority: 'high',
        },
        {
            id: 'INV-002',
            vendor: 'Vendor B',
            amount: 200,
            currency: 'USD',
            issueDate: '2025-01-20',
            dueDate: '2025-02-20',
            priority: 'normal',
        },
        {
            id: 'INV-003',
            vendor: 'Vendor C',
            amount: 50,
            currency: 'USD',
            issueDate: '2025-01-25',
            dueDate: '2025-02-25',
            priority: 'urgent',
        },
    ];

    it('should initialize with no selections', () => {
        const { result } = renderHook(() => useInvoiceSelection(mockInvoices));

        expect(result.current.selectedIds).toEqual([]);
        expect(result.current.selectedInvoices).toEqual([]);
        expect(result.current.totalAmount).toBe(0);
        expect(result.current.fee).toBe(0);
        expect(result.current.totalToPay).toBe(0);
    });

    it('should toggle selection for an invoice', () => {
        const { result } = renderHook(() => useInvoiceSelection(mockInvoices));

        act(() => {
            result.current.toggleSelection('INV-001');
        });

        expect(result.current.selectedIds).toEqual(['INV-001']);
        expect(result.current.selectedInvoices).toEqual([mockInvoices[0]]);
    });

    it('should calculate total amount for selected invoices', () => {
        const { result } = renderHook(() => useInvoiceSelection(mockInvoices));

        act(() => {
            result.current.toggleSelection('INV-001'); // 100
            result.current.toggleSelection('INV-002'); // 200
        });

        expect(result.current.totalAmount).toBe(300);
    });

    it('should add fixed fee of 5.0 when invoices are selected', () => {
        const { result } = renderHook(() => useInvoiceSelection(mockInvoices));

        act(() => {
            result.current.toggleSelection('INV-001');
        });

        expect(result.current.fee).toBe(5.0);
        expect(result.current.totalToPay).toBe(105.0); // 100 + 5
    });

    it('should toggle selection off when clicking selected invoice', () => {
        const { result } = renderHook(() => useInvoiceSelection(mockInvoices));

        act(() => {
            result.current.toggleSelection('INV-001');
        });

        expect(result.current.selectedIds).toEqual(['INV-001']);

        act(() => {
            result.current.toggleSelection('INV-001');
        });

        expect(result.current.selectedIds).toEqual([]);
        expect(result.current.totalAmount).toBe(0);
    });

    it('should handle multiple selections', () => {
        const { result } = renderHook(() => useInvoiceSelection(mockInvoices));

        act(() => {
            result.current.toggleSelection('INV-001');
            result.current.toggleSelection('INV-002');
            result.current.toggleSelection('INV-003');
        });

        expect(result.current.selectedIds.length).toBe(3);
        expect(result.current.totalAmount).toBe(350); // 100 + 200 + 50
        expect(result.current.totalToPay).toBe(355); // 350 + 5
    });

    it('should clear all selections', () => {
        const { result } = renderHook(() => useInvoiceSelection(mockInvoices));

        act(() => {
            result.current.toggleSelection('INV-001');
            result.current.toggleSelection('INV-002');
        });

        expect(result.current.selectedIds.length).toBe(2);

        act(() => {
            result.current.clearSelection();
        });

        expect(result.current.selectedIds).toEqual([]);
        expect(result.current.selectedInvoices).toEqual([]);
        expect(result.current.totalAmount).toBe(0);
        expect(result.current.fee).toBe(0);
    });

    it('should recalculate when invoice list changes', () => {
        const { result, rerender } = renderHook(
            ({ invoices }: { invoices: Invoice[] }) => useInvoiceSelection(invoices),
            { initialProps: { invoices: mockInvoices } }
        );

        act(() => {
            result.current.toggleSelection('INV-001');
        });

        expect(result.current.totalAmount).toBe(100);

        // Update invoice amount
        const updatedInvoices = [...mockInvoices];
        updatedInvoices[0] = { ...updatedInvoices[0], amount: 150 };

        rerender({ invoices: updatedInvoices });

        expect(result.current.totalAmount).toBe(150);
    });
});
