import React, { memo } from 'react';
import type { InvoiceRowProps } from '../types/InvoiceRow';

export const InvoiceRow: React.FC<InvoiceRowProps> = memo(({ invoice, isSelected, onToggle }) => {
    const formattedAmount = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: invoice.currency,
        minimumFractionDigits: 2,
    }).format(invoice.amount);

    const formatMonthYear = (value: string) =>
        new Date(value).toLocaleDateString(undefined, {
            month: 'short',
            year: 'numeric',
        });

    return (
        <tr className={isSelected ? 'selected' : ''}>
            <td>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(invoice.id)}
                />
            </td>
            <td>{invoice.id}</td>
            <td>{invoice.vendor}</td>
            <td>{formatMonthYear(invoice.issueDate)}</td>
            <td>{formatMonthYear(invoice.dueDate)}</td>
            <td>{formattedAmount}</td>
            <td>
                <span className={`priority ${invoice.priority}`}>
                    {invoice.priority}
                </span>
            </td>
        </tr>
    );
});

export default InvoiceRow;
