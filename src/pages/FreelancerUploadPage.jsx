import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import config from '../js/config';
import { getAuth } from 'firebase/auth';
import '../css/custom_request.css'; // Reusing form styles

const FreelancerUploadPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        domain: 'Web',
        tech_stack: '',
        tier1_price: '',
        tier2_price: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters.';
        if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters.';
        if (parseFloat(formData.tier1_price) <= 0) newErrors.tier1_price = 'Price must be greater than 0.';
        if (parseFloat(formData.tier2_price) <= 0) newErrors.tier2_price = 'Price must be greater than 0.';
        if (!formData.tech_stack) newErrors.tech_stack = 'Tech stack is required.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const auth = getAuth();
            const token = await auth.currentUser?.getIdToken();
            
            if (!token) throw new Error('You must be logged in to upload.');

            const response = await fetch(`${config.API_BASE_URL}/api/projects/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    tier1_price: parseFloat(formData.tier1_price),
                    tier2_price: parseFloat(formData.tier2_price)
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to upload project');
            }

            setIsSuccess(true);
            setTimeout(() => navigate('/freelancer/dashboard'), 3000);
        } catch (err) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="custom-request-container">
            <Sidebar activePage="freelancer-dashboard" />
            
            <main className="custom-request-main">
                <TopBar />

                <div className="form-card">
                    {isSuccess ? (
                        <div className="success-card">
                            <div className="success-icon">🚀</div>
                            <h2>Project Published!</h2>
                            <p style={{ color: '#888' }}>Your project is now live in the marketplace.</p>
                            <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <>
                            <div className="form-header">
                                <h1>Publish New Project</h1>
                                <p>Fill in the details to list your engineering project.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Project Title</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        placeholder="e.g., E-commerce platform with React"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                    {errors.title && <span className="error-text">{errors.title}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Domain</label>
                                    <select 
                                        name="domain" 
                                        value={formData.domain} 
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                    >
                                        <option value="Web">Web Development</option>
                                        <option value="Mobile">Mobile Apps</option>
                                        <option value="AI/ML">AI / Machine Learning</option>
                                        <option value="Blockchain">Blockchain</option>
                                        <option value="Cybersecurity">Cybersecurity</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea 
                                        name="description" 
                                        rows="5"
                                        placeholder="Describe features, implementation, and included files..."
                                        value={formData.description}
                                        onChange={handleChange}
                                    ></textarea>
                                    {errors.description && <span className="error-text">{errors.description}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Tech Stack (comma separated)</label>
                                    <input 
                                        type="text" 
                                        name="tech_stack" 
                                        placeholder="React, FastAPI, PostgreSQL, AWS"
                                        value={formData.tech_stack}
                                        onChange={handleChange}
                                    />
                                    {errors.tech_stack && <span className="error-text">{errors.tech_stack}</span>}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label>Basic Price (₹)</label>
                                        <input 
                                            type="number" 
                                            name="tier1_price" 
                                            placeholder="49"
                                            value={formData.tier1_price}
                                            onChange={handleChange}
                                        />
                                        {errors.tier1_price && <span className="error-text">{errors.tier1_price}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Premium Price (₹)</label>
                                        <input 
                                            type="number" 
                                            name="tier2_price" 
                                            placeholder="99"
                                            value={formData.tier2_price}
                                            onChange={handleChange}
                                        />
                                        {errors.tier2_price && <span className="error-text">{errors.tier2_price}</span>}
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="submit-btn" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Uploading...' : 'Publish Project'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FreelancerUploadPage;
