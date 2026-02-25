import React, { useState, useEffect } from 'react';
import './PaymentModal.css';

interface PaymentResult {
    refNumber: string;
    paymentTime: string;
    amount: number;
    fee: number;
}

interface Props {
    isOpen: boolean;
    amount: number;
    fee?: number;
    currency?: string;
    onClose: () => void;
    onSubmit?: (data: any) => void;
    onSuccess?: (result: PaymentResult) => void;
}

export const PaymentModal: React.FC<Props> = ({ isOpen, amount, fee = 0, currency = 'USD', onClose, onSubmit, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [name, setName] = useState('');
    const [country, setCountry] = useState('United States');
    const [zip, setZip] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // clear fields when closed
            setEmail('');
            setCardNumber('');
            setExpiry('');
            setCvc('');
            setName('');
            setCountry('United States');
            setZip('');
            setPaymentResult(null);
        }
    }, [isOpen]);

    const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // simulate payment processing
        const now = new Date();
        const result: PaymentResult = {
            refNumber: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
            paymentTime: now.toLocaleString(),
            amount,
            fee: fee || 0,
        };

        if (onSubmit) {
            onSubmit({ email, cardNumber, expiry, cvc, name, country, zip, amount });
        }

        setPaymentResult(result);
        if (onSuccess) {
            onSuccess(result);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {paymentResult ? (
                    <div className="success-container">
                        <div className="success-icon">✔️</div>
                        <h2>Payment Success!</h2>
                        <div className="success-total">
                            {new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(paymentResult.amount)}
                        </div>
                        <table className="success-table">
                            <tbody>
                                <tr>
                                    <td className="label-cell">Ref Number</td>
                                    <td className="value-cell">{paymentResult.refNumber}</td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Payment Time</td>
                                    <td className="value-cell">{paymentResult.paymentTime}</td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Amount</td>
                                    <td className="value-cell">{new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(paymentResult.amount)}</td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Fee</td>
                                    <td className="value-cell">{new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(paymentResult.fee)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <>
                        <h2>Payment Information</h2>
                        <form onSubmit={handleSubmit} className="payment-form">
                            <label className="full-width">Email
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </label>

                            <div className="card-group">
                                <label className="full-width">Card information
                                    <div className="card-input-wrapper">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            placeholder="1234 1234 1234 1234"
                                            required
                                        />
                                        <div className="card-logos">
                                            {/* card brand icons via CSS */}
                                            <span className="card-logo visa" />
                                            <span className="card-logo mastercard" />
                                            <span className="card-logo amex" />
                                            <span className="card-logo discover" />
                                        </div>
                                    </div>
                                </label>

                                <div className="card-row">
                                    <label>MM / YY
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            placeholder="MM / YY"
                                            required
                                        />
                                    </label>
                                    <label className="cvc-wrapper">CVC
                                        <input
                                            type="text"
                                            value={cvc}
                                            onChange={(e) => setCvc(e.target.value)}
                                            placeholder="CVC"
                                            required
                                        />
                                        <span className="cvc-icon" title="3-digit code on back of card">ℹ️</span>
                                    </label>
                                </div>
                            </div>

                            <label className="full-width">Cardholder name
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Full name on card"
                                    required
                                />
                            </label>

                            <div className="country-group">
                                <label>Country or region
                                    <select value={country} onChange={(e) => setCountry(e.target.value)}>
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                        <option>Australia</option>
                                        {/* add more as needed */}
                                    </select>
                                </label>

                                <label>ZIP
                                    <input
                                        type="text"
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            <button type="submit" className="pay-modal-button">
                                Pay {new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)}
                            </button>
                        </form>
                        <p className="disclaimer">By clicking Pay, you agree to the Link Terms and Privacy Policy.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
