import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import config from '../js/config';
import { getAuth } from 'firebase/auth';
import '../css/checkout.css';

const CheckoutPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/projects/${projectId}`);
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

        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            
            // 1. Create Razorpay Order on Backend
            const orderResponse = await fetch(`${config.API_BASE_URL}/api/orders/create-razorpay-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ project_id: parseInt(projectId) })
            });

            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                throw new Error(errorData.detail || 'Failed to initialize payment');
            }

            const orderData = await orderResponse.json();

            // 2. Configure Razorpay Options
            const options = {
                key: orderData.key_id,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Buildora Marketplace",
                description: `Purchase: ${project.title}`,
                order_id: orderData.order_id,
                handler: async (response) => {
                    // 3. Verify Payment on Backend
                    try {
                        const verifyResponse = await fetch(`${config.API_BASE_URL}/api/orders/verify-payment`, {
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
                    ondismiss: () => {
                        setIsProcessing(false);
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

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
                            <p className="checkout-subtitle">Secure payment via Razorpay. Fast, safe, and reliable.</p>
                            
                            {error && <div className="error-alert">{error}</div>}

                            <div className="payment-details-box">
                                <div className="detail-row">
                                    <span>Currency</span>
                                    <span>INR (Indian Rupee)</span>
                                </div>
                                <div className="detail-row">
                                    <span>Method</span>
                                    <span>UPI / Card / Netbanking</span>
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
                                    `Proceed to Pay ₹${project.tier1_price}`
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
