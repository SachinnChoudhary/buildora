import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupWithEmail, loginWithGoogle } from '../js/firebase';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const fullName = `${formData.firstName} ${formData.lastName}`;

        try {
            const user = await signupWithEmail(formData.email, formData.password, fullName);
            const token = await user.getIdToken();
            localStorage.setItem('buildora_token', token);
            localStorage.setItem('buildora_user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: fullName
            }));
            navigate('/dashboard');
        } catch (err) {
            const messages = {
                'auth/email-already-in-use': 'This email is already registered. Try logging in.',
                'auth/weak-password': 'Password must be at least 6 characters.',
                'auth/invalid-email': 'Invalid email address.',
                'auth/too-many-requests': 'Too many attempts. Try again later.'
            };
            setError(messages[err.code] || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        try {
            const user = await loginWithGoogle();
            const token = await user.getIdToken();
            localStorage.setItem('buildora_token', token);
            localStorage.setItem('buildora_user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            }));
            navigate('/dashboard');
        } catch (err) {
            if (err.code !== 'auth/popup-closed-by-user') {
                setError('Google sign-up failed. Try again.');
            }
        }
    };

    return (
        <main className="auth-hero">
            <div className="login-container">
                <div className="form-glass">
                    <div className="login-header">
                        <Link to="/" className="nav-logo">
                            <img src="/src/assets/buildora-logo.svg" alt="Buildora" className="logo-img" style={{ width: '48px', height: '48px' }} />
                            <span className="logo-text" style={{ fontSize: '28px' }}>&lt;Buildora/&gt;</span>
                        </Link>
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 700, marginTop: '16px' }}>Create Account</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Join the Buildora marketplace today</p>
                    </div>

                    <button 
                        onClick={handleGoogleSignUp}
                        className="btn-lg btn-full" 
                        style={{ marginBottom: '20px', background: '#fff', color: '#333', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px', fontWeight: 600, transition: 'all 0.3s ease' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                        Continue with Google
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>or sign up with email</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    </div>

                    <form onSubmit={handleEmailSignup} className="contact-form">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" value={formData.email} onChange={handleChange} placeholder="name@college.edu" required />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Create Password</label>
                            <input type="password" id="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required minLength={6} />
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Minimum 6 characters</p>
                        </div>

                        {error && (
                            <div style={{ color: '#ef4444', fontSize: '14px', padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', marginTop: '8px' }}>
                                {error}
                            </div>
                        )}

                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
                            By signing up, you agree to our <Link to="/terms" style={{ color: 'var(--primary-light)' }}>Terms</Link> and <Link to="/privacy" style={{ color: 'var(--primary-light)' }}>Privacy</Link>.
                        </p>

                        <button type="submit" disabled={loading} className="btn-primary btn-lg btn-full" style={{ marginTop: '24px' }}>
                            {loading ? 'Creating Account...' : 'Start Your Journey 🚀'}
                        </button>
                        
                        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '15px' }}>
                            Already part of Buildora? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px dashed var(--primary-light)' }}>Log In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default SignupPage;
