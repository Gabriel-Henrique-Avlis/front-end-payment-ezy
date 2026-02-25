import React, { memo } from 'react';
import type { Invoice } from '../types/Invoice';

interface Props {
    invoice: Invoice;
    isSelected: boolean;
    onToggle: (id: string) => void;
}

export const InvoiceRow: React.FC<Props> = memo(({ invoice, isSelected, onToggle }) => {
    const formattedAmount = new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: invoice.currency,
        minimumFractionDigits: 2,
    }).format(invoice.amount);

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
            <td>{invoice.issueDate}</td>
            <td>{invoice.dueDate}</td>
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
