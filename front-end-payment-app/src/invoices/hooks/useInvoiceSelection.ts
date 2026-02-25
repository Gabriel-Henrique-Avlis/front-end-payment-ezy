import { useState, useCallback, useMemo } from 'react';
import type { Invoice } from '../types/Invoice';

export function useInvoiceSelection(invoices: Invoice[]) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    }, []);

    const selectedInvoices = useMemo(
        () => invoices.filter((inv) => selectedIds.includes(inv.id)),
        [invoices, selectedIds]
    );

    const totalAmount = useMemo(
        () => selectedInvoices.reduce((sum, inv) => sum + inv.amount, 0),
        [selectedInvoices]
    );

    const fee = useMemo(() => (totalAmount ? 5.0 : 0), [totalAmount]);
    const totalToPay = useMemo(() => totalAmount + fee, [totalAmount, fee]);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    return {
        selectedIds,
        toggleSelection,
        selectedInvoices,
        totalAmount,
        fee,
        totalToPay,
        clearSelection,
    };
}
