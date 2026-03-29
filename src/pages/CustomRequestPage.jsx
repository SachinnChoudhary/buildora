import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import config from '../js/config';
import { getAuth } from 'firebase/auth';
import '../css/custom_request.css';

const CustomRequestPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget_range: '',
        deadline: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters long.';
        if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters long to help developers understand your needs.';
        if (!formData.budget_range) newErrors.budget_range = 'Budget range is required.';
        if (!formData.deadline) newErrors.deadline = 'Deadline is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error as user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            
            if (!token) {
                alert('You must be logged in to submit a request.');
                return;
            }

            const response = await fetch(`${config.API_BASE_URL}/api/custom-requests/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to submit request');
            }

            setIsSuccess(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            console.error('Submission error:', err);
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="custom-request-container">
            <Sidebar activePage="custom-request" />
            
            <main className="custom-request-main">
                <TopBar />

                <div className="form-card">
                    {isSuccess ? (
                        <div className="success-card">
                            <div className="success-icon">✅</div>
                            <h2>Request Submitted!</h2>
                            <p style={{ color: '#888' }}>Your custom request has been posted. Developers will contact you shortly.</p>
                            <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <div className="form-header">
                                <h1>Submit a Custom Request</h1>
                                <p>Can't find what you need? Tell us your requirements.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Project Title</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        placeholder="e.g., Real-time Chat App with End-to-End Encryption"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className={errors.title ? 'input-error' : ''}
                                    />
                                    {errors.title && <span className="error-text">{errors.title}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Detailed Description</label>
                                    <textarea 
                                        name="description" 
                                        rows="6"
                                        placeholder="Describe the features, tech stack, and goals..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={errors.description ? 'input-error' : ''}
                                    ></textarea>
                                    {errors.description && <span className="error-text">{errors.description}</span>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label>Budget Range</label>
                                        <input 
                                            type="text" 
                                            name="budget_range" 
                                            placeholder="e.g., ₹5000 - ₹10000"
                                            value={formData.budget_range}
                                            onChange={handleChange}
                                        />
                                        {errors.budget_range && <span className="error-text">{errors.budget_range}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Deadline</label>
                                        <input 
                                            type="text" 
                                            name="deadline" 
                                            placeholder="e.g., 2 weeks"
                                            value={formData.deadline}
                                            onChange={handleChange}
                                        />
                                        {errors.deadline && <span className="error-text">{errors.deadline}</span>}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Post Request'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CustomRequestPage;
