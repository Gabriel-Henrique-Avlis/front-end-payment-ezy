import React from 'react';
import type { Invoice } from '../types/Invoice';

interface Props {
    selectedInvoices: Invoice[];
    fee: number;
    totalToPay: number;
    onPay?: () => void;
}

export const Summary: React.FC<Props> = ({ selectedInvoices, fee, totalToPay, onPay }) => {
    const currency = selectedInvoices[0]?.currency || 'USD';
    const formatAmount = (amount: number) =>
        new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(amount);

    return (
        <div className="summary-box">
            <h2>Payment summary</h2>
            {selectedInvoices.length === 0 && <p>No invoices selected.</p>}
            {selectedInvoices.map((inv) => (
                <div key={inv.id} className="summary-row">
                    <span>{inv.id}</span>
                    <span>{formatAmount(inv.amount)}</span>
                </div>
            ))}
            {selectedInvoices.length > 0 && (
                <>
                    <div className="summary-row fee">
                        <span>Fee</span>
                        <span>{formatAmount(fee)}</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>{formatAmount(totalToPay)}</span>
                    </div>
                    <button className="pay-button" onClick={onPay}>
                        Pay {formatAmount(totalToPay)}
                    </button>
                </>
            )}
        </div>
    );
};

export default Summary;
