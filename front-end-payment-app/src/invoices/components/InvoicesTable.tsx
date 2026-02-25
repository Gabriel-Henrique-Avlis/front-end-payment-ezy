import React, { useState, useMemo } from 'react';
import type { Invoice } from '../types/Invoice';
import InvoiceRow from './InvoiceRow';

type SortKey = 'id' | 'vendor' | 'issueDate' | 'dueDate' | 'amount' | 'priority';

interface Props {
    invoices: Invoice[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export const InvoicesTable: React.FC<Props> = ({ invoices, selectedIds, onToggle }) => {
    const [sortKey, setSortKey] = useState<SortKey>('id');
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

    const handleHeaderClick = (key: SortKey) => {
        if (key === sortKey) {
            setAsc(!asc);
        } else {
            setSortKey(key);
            setAsc(true);
        }
    };

    const arrow = (key: SortKey) => {
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
