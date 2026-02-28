import React, { useState } from 'react';
import './InvoicesPage.css';

import { sampleData } from './data/sampleInvoices';
import { useInvoiceSelection } from './hooks/useInvoiceSelection';
import InvoicesTable from './components/InvoicesTable';
import Summary from './components/Summary';
import { PaymentModal } from './components/PaymentModal';

export const InvoicesPage: React.FC = () => {
    const { invoices, lastUpdated } = sampleData;

    const {
        selectedIds,
        toggleSelection,
        selectedInvoices,
        fee,
        totalToPay,
        clearSelection,
    } = useInvoiceSelection(invoices);

    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleSuccess = () => {
        // after payment, clear selected invoices (modal will remain open to show success)
        clearSelection();
    };

    return (
        <div className="invoices-page">
            <header className="header">
                <div className="header-left">
                    <div className="logo-placeholder">LOGO</div>
                    <h1>INVOICES TO PAY</h1>
                </div>
                <div className="header-right">
                    <div className="total-card">
                        <div className="total-label">Total amount to pay</div>
                        <div className="total-value">
                            {new Intl.NumberFormat(undefined, { style: 'currency', currency: selectedInvoices[0]?.currency || 'USD' }).format(totalToPay)}
                        </div>
                        <div className="total-date">{new Date(lastUpdated).toLocaleDateString()}</div>
                    </div>
                </div>
            </header>
            <main className="content">
                <section className="table-section">
                    <InvoicesTable
                        invoices={invoices}
                        selectedIds={selectedIds}
                        onToggle={toggleSelection}
                    />
                </section>
                <aside className="summary">
                    <Summary
                        selectedInvoices={selectedInvoices}
                        fee={fee}
                        totalToPay={totalToPay}
                        onPay={openModal}
                    />
                </aside>
            </main>
            <PaymentModal
                isOpen={showModal}
                amount={totalToPay}
                fee={fee}
                currency={selectedInvoices[0]?.currency || 'USD'}
                onClose={closeModal}
                onSuccess={handleSuccess}
            />
        </div>
    );
};

export default InvoicesPage;
