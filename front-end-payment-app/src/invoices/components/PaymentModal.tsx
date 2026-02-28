import React, { useState, useEffect } from 'react';
import './PaymentModal.css';
import { createPayment, generateIdempotencyKey } from '../../services/paymentService';

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError(null);
            setLoading(false);
        }
    }, [isOpen]);

    const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Split full name into first and last
            const nameParts = name.trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Generate idempotency key to prevent duplicate payments
            const idempotencyKey = generateIdempotencyKey();

            // Call payment API
            const response = await createPayment(
                {
                    firstName,
                    lastName,
                    cardNumber: cardNumber.replace(/\s+/g, ''), // remove spaces
                    expiry,
                    cvv: cvc, // API expects "cvv" field
                },
                idempotencyKey
            );

            // Build result from API response
            const result: PaymentResult = {
                refNumber: response.data.refNumber,
                paymentTime: response.data.paymentTime,
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
        } catch (err: any) {
            console.error('Payment failed:', err);

            // Handle different error scenarios
            if (err.response?.status === 409) {
                setError('Duplicate payment detected. This transaction has already been processed.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Payment failed. Please check your card details and try again.');
            }
        } finally {
            setLoading(false);
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

                            {error && (
                                <div className="error-message" style={{
                                    color: '#d32f2f',
                                    backgroundColor: '#ffebee',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    marginBottom: '16px',
                                    fontSize: '14px'
                                }}>
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="pay-modal-button" disabled={loading}>
                                {loading ? 'Processing...' : `Pay ${new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount)}`}
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
