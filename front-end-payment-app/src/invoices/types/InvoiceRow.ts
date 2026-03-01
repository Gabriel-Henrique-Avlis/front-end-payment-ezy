import type { Invoice } from './Invoice';

export interface InvoiceRowProps {
    invoice: Invoice;
    isSelected: boolean;
    onToggle: (id: string) => void;
}
