import React, { useState, useEffect } from 'react';
import './PaymentModal.css';
import { createPayment, generateIdempotencyKey } from '../../services/paymentService';
import { getApiErrorMessage } from '../../services/errorHandler';
import type { PaymentResult, PaymentModalProps, PaymentFormData } from '../types/PaymentModal';
import { initialPaymentFormData } from '../types/PaymentModal';
import {
    splitCardholderName,
    sanitizeCardNumber,
    formatCurrency,
    buildPaymentResult,
    toSubmitPayload,
} from '../utils/paymentModal';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, amount, fee = 0, currency = 'USD', onClose, onSubmit, onSuccess }) => {
    const [formData, setFormData] = useState<PaymentFormData>(initialPaymentFormData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

    const updateField = <K extends keyof PaymentFormData>(field: K, value: PaymentFormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData(initialPaymentFormData);
            setPaymentResult(null);
            setError(null);
            setLoading(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const { firstName, lastName } = splitCardholderName(formData.name);
            const idempotencyKey = generateIdempotencyKey();

            const response = await createPayment(
                {
                    firstName,
                    lastName,
                    cardNumber: sanitizeCardNumber(formData.cardNumber),
                    expiry: formData.expiry,
                    cvv: formData.cvc,
                },
                idempotencyKey
            );

            const result: PaymentResult = buildPaymentResult(response.data, amount, fee || 0);

            if (onSubmit) {
                onSubmit(toSubmitPayload(formData, amount));
            }

            setPaymentResult(result);
            if (onSuccess) {
                onSuccess(result);
            }
        } catch (err: unknown) {
            console.error('Payment failed:', err);
            setError(getApiErrorMessage(err));
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
                            {formatCurrency(paymentResult.amount, currency)}
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
                                    <td className="value-cell">{formatCurrency(paymentResult.amount, currency)}</td>
                                </tr>
                                <tr>
                                    <td className="label-cell">Fee</td>
                                    <td className="value-cell">{formatCurrency(paymentResult.fee, currency)}</td>
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
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    required
                                />
                            </label>

                            <div className="card-group">
                                <label className="full-width">Card information
                                    <div className="card-input-wrapper">
                                        <input
                                            type="text"
                                            value={formData.cardNumber}
                                            onChange={(e) => updateField('cardNumber', e.target.value)}
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
                                            value={formData.expiry}
                                            onChange={(e) => updateField('expiry', e.target.value)}
                                            placeholder="MM / YY"
                                            required
                                        />
                                    </label>
                                    <label className="cvc-wrapper">CVC
                                        <input
                                            type="text"
                                            value={formData.cvc}
                                            onChange={(e) => updateField('cvc', e.target.value)}
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
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Full name on card"
                                    required
                                />
                            </label>

                            <div className="country-group">
                                <label>Country or region
                                    <select value={formData.country} onChange={(e) => updateField('country', e.target.value)}>
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
                                        value={formData.zip}
                                        onChange={(e) => updateField('zip', e.target.value)}
                                        required
                                    />
                                </label>
                            </div>

                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            <button type="submit" className="pay-modal-button" disabled={loading}>
                                {loading ? 'Processing...' : `Pay ${formatCurrency(amount, currency)}`}
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
