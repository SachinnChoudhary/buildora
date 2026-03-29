import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { API_BASE, config } from '../js/config';
import { getAuth } from 'firebase/auth';
import '../css/checkout.css';

const CheckoutPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'phonepe'

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/projects/${projectId}`);
                if (!response.ok) throw new Error('Project not found');
                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    const handlePayment = async () => {
        setIsProcessing(true);
        setError(null);

        if (paymentMethod === 'razorpay') {
            await handleRazorpay();
        } else {
            await handlePhonePe();
        }
    };

    const handleRazorpay = async () => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            
            // 1. Create Razorpay Order on Backend
            const orderResponse = await fetch(`${API_BASE}/api/orders/create-razorpay-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ project_id: parseInt(projectId) })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.detail || 'Failed to initialize Razorpay');
            }

            const orderData = await orderResponse.json();

            // 2. Configure Razorpay Options
            const options = {
                key: config.RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Buildora Marketplace",
                description: `Purchase: ${project.title}`,
                order_id: orderData.order_id,
                handler: async (response) => {
                    // 3. Verify Payment on Backend
                    try {
                        const verifyResponse = await fetch(`${API_BASE}/api/orders/verify-payment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        if (verifyResponse.ok) {
                            navigate('/dashboard', { state: { message: 'Purchase successful!' } });
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err) {
                        setError(err.message);
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: auth.currentUser?.displayName || "",
                    email: auth.currentUser?.email || "",
                },
                theme: {
                    color: "#6366f1",
                },
                modal: {
                    ondismiss: () => setIsProcessing(false)
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err.message);
            setIsProcessing(false);
        }
    };

    const handlePhonePe = async () => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();

            // 1. Create PhonePe Order on Backend
            const orderResponse = await fetch(`${API_BASE}/api/phonepe/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ project_id: parseInt(projectId) })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.detail || 'Failed to initialize PhonePe');
            }

            const orderData = await orderResponse.json();

            // 2. Redirect to PhonePe Payment Page
            if (orderData.redirect_url) {
                window.location.href = orderData.redirect_url;
            } else {
                throw new Error('No redirect URL received from PhonePe');
            }
        } catch (err) {
            setError(err.message);
            setIsProcessing(false);
        }
    };
    if (loading) return <div className="loading-container">Loading checkout...</div>;
    if (!project) return <div className="error-container">Project not found</div>;

    return (
        <div className="checkout-container">
            <Sidebar />
            
            <main className="checkout-main">
                <TopBar />

                <div className="checkout-content">
                    <section className="payment-section">
                        <div className="payment-card-status">
                            <div className="shield-icon">🛡️</div>
                            <h2 className="checkout-title">Secure Checkout</h2>
                            <p className="checkout-subtitle">Choose your preferred secure payment method.</p>
                            
                            {error && <div className="error-alert">{error}</div>}

                            <div className="payment-methods-selector">
                                <label className={`method-option ${paymentMethod === 'razorpay' ? 'active' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="razorpay" 
                                        checked={paymentMethod === 'razorpay'} 
                                        onChange={() => setPaymentMethod('razorpay')}
                                    />
                                    <div className="method-info">
                                        <span className="method-name">Razorpay</span>
                                        <span className="method-desc">Cards, Netbanking, UPI</span>
                                    </div>
                                </label>

                                <label className={`method-option ${paymentMethod === 'phonepe' ? 'active' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="phonepe" 
                                        checked={paymentMethod === 'phonepe'} 
                                        onChange={() => setPaymentMethod('phonepe')}
                                    />
                                    <div className="method-info">
                                        <span className="method-name">PhonePe</span>
                                        <span className="method-desc">UPI, Wallet, Cards</span>
                                    </div>
                                </label>
                            </div>

                            <div className="payment-details-box">
                                <div className="detail-row">
                                    <span>Currency</span>
                                    <span>INR (Indian Rupee)</span>
                                </div>
                                <div className="detail-row">
                                    <span>Gateway</span>
                                    <span style={{ textTransform: 'capitalize' }}>{paymentMethod}</span>
                                </div>
                            </div>

                            <button 
                                onClick={handlePayment} 
                                className="pay-btn primary" 
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="spinner"></span>
                                        Initializing...
                                    </>
                                ) : (
                                    `Proceed with ${paymentMethod === 'razorpay' ? 'Razorpay' : 'PhonePe'} — ₹${project.tier1_price}`
                                )}
                            </button>
                            
                            <p className="trust-footer">
                                🔒 Your data is protected with 256-bit encryption.
                            </p>
                        </div>
                    </section>

                    <section className="summary-section">
                        <h2 style={{ marginBottom: '1.5rem', color: 'white' }}>Order Summary</h2>
                        <div className="checkout-info">
                            <h3 style={{ color: '#6366f1' }}>{project.title}</h3>
                            <p style={{ color: '#aaa' }}>{project.domain}</p>
                        </div>

                        <div className="summary-row">
                            <span>Project Price</span>
                            <span>₹{project.tier1_price}</span>
                        </div>
                        <div className="summary-row">
                            <span>Platform Fee</span>
                            <span>₹0.00</span>
                        </div>
                        
                        <div className="summary-row summary-total">
                            <span>Total Amount</span>
                            <span>₹{project.tier1_price}</span>
                        </div>

                        <div className="purchase-benefits">
                            <p>✅ Instant access after payment</p>
                            <p>✅ Full documentation included</p>
                            <p>✅ 24/7 priority support</p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
