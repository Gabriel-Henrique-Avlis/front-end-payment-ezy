import React, { useState, useMemo } from 'react';
import type { InvoicesTableProps } from '../types/InvoicesTable';
import type { InvoiceSortKey } from '../types/InvoiceSortKey';
import InvoiceRow from './InvoiceRow';

export const InvoicesTable: React.FC<InvoicesTableProps> = ({ invoices, selectedIds, onToggle }) => {
    const [sortKey, setSortKey] = useState<InvoiceSortKey>('id');
    const [asc, setAsc] = useState(true);

    const sorted = useMemo(() => {
        return [...invoices].sort((a, b) => {
            let av: any = a[sortKey];
            let bv: any = b[sortKey];
            if (typeof av === 'string') av = av.toLowerCase();
            if (typeof bv === 'string') bv = bv.toLowerCase();
            if (av < bv) return asc ? -1 : 1;
            if (av > bv) return asc ? 1 : -1;
            return 0;
        });
    }, [invoices, sortKey, asc]);

    const handleHeaderClick = (key: InvoiceSortKey) => {
        if (key === sortKey) {
            setAsc(!asc);
        } else {
            setSortKey(key);
            setAsc(true);
        }
    };

    const arrow = (key: InvoiceSortKey) => {
        if (key !== sortKey) return '';
        return asc ? '↑' : '↓';
    };

    return (
        <table className="invoices-table">
            <thead>
                <tr>
                    <th></th>
                    <th
                        className={sortKey === 'id' ? 'sorted' : ''}
                        onClick={() => handleHeaderClick('id')}
                    >
                        Number {arrow('id')}
                    </th>
                    <th
                        className={sortKey === 'vendor' ? 'sorted' : ''}
                        onClick={() => handleHeaderClick('vendor')}
                    >
                        Vendor {arrow('vendor')}
                    </th>
                    <th
                        className={sortKey === 'issueDate' ? 'sorted' : ''}
                        onClick={() => handleHeaderClick('issueDate')}
                    >
                        Issue date {arrow('issueDate')}
                    </th>
                    <th
                        className={sortKey === 'dueDate' ? 'sorted' : ''}
                        onClick={() => handleHeaderClick('dueDate')}
                    >
                        Due date {arrow('dueDate')}
                    </th>
                    <th
                        className={sortKey === 'amount' ? 'sorted' : ''}
                        onClick={() => handleHeaderClick('amount')}
                    >
                        Amount {arrow('amount')}
                    </th>
                    <th
                        className={sortKey === 'priority' ? 'sorted' : ''}
                        onClick={() => handleHeaderClick('priority')}
                    >
                        Priority {arrow('priority')}
                    </th>
                </tr>
            </thead>
            <tbody>
                {sorted.map((inv) => (
                    <InvoiceRow
                        key={inv.id}
                        invoice={inv}
                        isSelected={selectedIds.includes(inv.id)}
                        onToggle={onToggle}
                    />
                ))}
            </tbody>
        </table>
    );
};

export default InvoicesTable;
