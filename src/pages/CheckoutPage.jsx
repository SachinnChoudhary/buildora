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
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
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

    const handlePayment = async (e) => {
        e.preventDefault();
        if (cardNumber.length < 16) {
            setError('Please enter a valid 16-digit card number.');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            
            const response = await fetch(`${config.API_BASE_URL}/api/orders/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    project_id: parseInt(projectId),
                    card_number: cardNumber
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Payment failed');
            }

            navigate('/dashboard', { state: { message: 'Purchase successful!' } });
        } catch (err) {
            setError(err.message);
        } finally {
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
                        <h2 className="checkout-title">Payment Method</h2>
                        
                        {error && <div style={{ color: '#ff4d4d', marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,77,77,0.1)', borderRadius: '10px' }}>{error}</div>}

                        <form className="payment-form" onSubmit={handlePayment}>
                            <div className="form-group">
                                <label>Cardholder Name</label>
                                <input type="text" placeholder="John Doe" required />
                            </div>
                            
                            <div className="form-group">
                                <label>Card Number</label>
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000" 
                                    maxLength="16"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                                    required 
                                />
                            </div>

                            <div className="card-details">
                                <div className="form-group">
                                    <label>Expiry Date</label>
                                    <input 
                                        type="text" 
                                        placeholder="MM/YY" 
                                        maxLength="5"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input 
                                        type="password" 
                                        placeholder="***" 
                                        maxLength="3"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                        required 
                                    />
                                </div>
                            </div>

                            <button type="submit" className="pay-btn" disabled={isProcessing}>
                                {isProcessing ? 'Processing...' : `Pay $${project.tier1_price}`}
                            </button>
                        </form>
                    </section>

                    <section className="summary-section">
                        <h2 style={{ marginBottom: '1.5rem' }}>Order Summary</h2>
                        <div className="checkout-info">
                            <h3>{project.title}</h3>
                            <p>{project.domain}</p>
                        </div>

                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${project.tier1_price}</span>
                        </div>
                        <div className="summary-row">
                            <span>Platform Fee</span>
                            <span>$0.00</span>
                        </div>
                        
                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>${project.tier1_price}</span>
                        </div>

                        <p style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                            Secure payment powered by Buildora Pay 🛡️
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default CheckoutPage;
