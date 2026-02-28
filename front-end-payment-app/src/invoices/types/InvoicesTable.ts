import type { Invoice } from './Invoice';

export interface InvoicesTableProps {
    invoices: Invoice[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}
