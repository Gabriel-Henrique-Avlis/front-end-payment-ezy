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
    maskCardNumber,
    maskExpiry,
    maskCvc,
    maskZip,
} from '../utils/paymentHelpers';

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
                                            onChange={(e) => updateField('cardNumber', maskCardNumber(e.target.value))}
                                            placeholder="1234 1234 1234 1234"
                                            inputMode="numeric"
                                            maxLength={19}
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
                                            onChange={(e) => updateField('expiry', maskExpiry(e.target.value))}
                                            placeholder="MM / YY"
                                            inputMode="numeric"
                                            maxLength={5}
                                            required
                                        />
                                    </label>
                                    <label className="cvc-wrapper">CVC
                                        <input
                                            type="text"
                                            value={formData.cvc}
                                            onChange={(e) => updateField('cvc', maskCvc(e.target.value))}
                                            placeholder="CVC"
                                            inputMode="numeric"
                                            maxLength={3}
                                            required
                                        />
                                        <span className="cvc-icon" title="3-digit code on back of card">
                                            <svg width="27" height="16" viewBox="0 0 27 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="6.10352e-05" y="1.06677" width="23.4667" height="14.9333" rx="1.06667" fill="#DBDBDB" />
                                                <rect x="6.10352e-05" y="3.19995" width="23.4667" height="3.2" fill="#B0B0B0" />
                                                <rect x="2.13348" y="8.5332" width="19.2" height="2.13333" rx="1.06667" fill="white" />
                                                <circle cx="21.3334" cy="5.33333" r="5.33333" fill="#4C4C4C" />
                                                <path d="M18.9341 3.3337V7.13318H18.2024V4.22953L17.4784 4.50818V3.8988L18.8534 3.3337H18.9341ZM20.6685 4.90141H21.0253C21.1156 4.90141 21.1902 4.88057 21.2492 4.83891C21.3083 4.79551 21.3517 4.73474 21.3795 4.65662C21.4072 4.57676 21.4211 4.48387 21.4211 4.37797C21.4211 4.28422 21.4081 4.20176 21.3821 4.13057C21.356 4.05766 21.3161 4.00037 21.2623 3.9587C21.2084 3.9153 21.1407 3.8936 21.0591 3.8936C20.9966 3.8936 20.9376 3.91096 20.8821 3.94568C20.8282 3.97866 20.7857 4.02728 20.7545 4.09151C20.7232 4.15575 20.7076 4.23214 20.7076 4.32068H19.9758C19.9758 4.11235 20.0227 3.93092 20.1164 3.77641C20.2119 3.62189 20.3404 3.5021 20.5019 3.41703C20.6633 3.33023 20.8421 3.28682 21.0383 3.28682C21.2588 3.28682 21.4524 3.32762 21.619 3.40922C21.7857 3.49082 21.9159 3.61235 22.0097 3.7738C22.1034 3.93353 22.1503 4.13144 22.1503 4.36755C22.1503 4.48908 22.1277 4.60627 22.0826 4.71912C22.0374 4.83023 21.9715 4.93092 21.8847 5.0212C21.7979 5.11148 21.692 5.18266 21.567 5.23474C21.442 5.28682 21.3005 5.31287 21.1425 5.31287H20.6685V4.90141ZM20.6685 5.49255V5.09412H21.1425C21.3213 5.09412 21.4767 5.11755 21.6086 5.16443C21.7406 5.20957 21.8499 5.27554 21.9367 5.36235C22.0253 5.44915 22.0913 5.55245 22.1347 5.67224C22.1781 5.7903 22.1998 5.92224 22.1998 6.06807C22.1998 6.24516 22.1703 6.40314 22.1112 6.54203C22.0522 6.68092 21.9697 6.79811 21.8638 6.8936C21.7579 6.98908 21.6347 7.062 21.494 7.11235C21.3534 7.16096 21.2006 7.18526 21.0357 7.18526C20.8986 7.18526 20.764 7.16356 20.6321 7.12016C20.5019 7.07676 20.3847 7.00991 20.2805 6.91964C20.1763 6.82936 20.0939 6.71564 20.0331 6.57849C19.9723 6.44134 19.942 6.27901 19.942 6.09151H20.6711C20.6711 6.18526 20.6876 6.26946 20.7206 6.34412C20.7553 6.41703 20.8013 6.47432 20.8586 6.51599C20.9159 6.55766 20.981 6.57849 21.0539 6.57849C21.139 6.57849 21.2128 6.55679 21.2753 6.51339C21.3378 6.46998 21.3855 6.40922 21.4185 6.3311C21.4515 6.25297 21.468 6.16269 21.468 6.06026C21.468 5.92485 21.4506 5.81634 21.4159 5.73474C21.3812 5.65141 21.3308 5.59064 21.2649 5.55245C21.1989 5.51252 21.119 5.49255 21.0253 5.49255H20.6685ZM23.3716 5.41443L22.7883 5.2686L22.9784 3.34151H24.8091V3.96651H23.5774L23.5071 4.78162C23.547 4.75384 23.606 4.72346 23.6841 4.69047C23.764 4.65748 23.8525 4.64099 23.9498 4.64099C24.1078 4.64099 24.2466 4.66964 24.3664 4.72693C24.488 4.78422 24.5904 4.86755 24.6737 4.97693C24.7571 5.0863 24.8204 5.21998 24.8638 5.37797C24.9072 5.53596 24.9289 5.71478 24.9289 5.91443C24.9289 6.08283 24.9064 6.24342 24.8612 6.3962C24.8161 6.54898 24.7466 6.68439 24.6529 6.80245C24.5591 6.92051 24.4428 7.01426 24.3039 7.0837C24.1668 7.15141 24.0045 7.18526 23.817 7.18526C23.6763 7.18526 23.5409 7.16096 23.4107 7.11235C23.2805 7.06373 23.1633 6.99169 23.0591 6.8962C22.955 6.79898 22.8716 6.68266 22.8091 6.54724C22.7466 6.41009 22.7154 6.25384 22.7154 6.07849H23.4367C23.4454 6.18092 23.4654 6.26946 23.4966 6.34412C23.5296 6.41877 23.573 6.47693 23.6269 6.5186C23.6807 6.55853 23.7432 6.57849 23.8144 6.57849C23.8855 6.57849 23.9454 6.56113 23.994 6.52641C24.0444 6.48995 24.0843 6.4396 24.1138 6.37537C24.1433 6.31113 24.1642 6.23648 24.1763 6.15141C24.1902 6.0646 24.1972 5.97172 24.1972 5.87276C24.1972 5.77207 24.1885 5.68092 24.1711 5.59932C24.1538 5.51773 24.1269 5.44741 24.0904 5.38839C24.0539 5.32936 24.0062 5.28422 23.9472 5.25297C23.8899 5.22172 23.823 5.2061 23.7466 5.2061C23.639 5.2061 23.5583 5.22866 23.5045 5.2738C23.4524 5.31721 23.4081 5.36408 23.3716 5.41443Z" fill="white" />
                                            </svg>
                                        </span>
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
                                        onChange={(e) => updateField('zip', maskZip(e.target.value))}
                                        maxLength={12}
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
