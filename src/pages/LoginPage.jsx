import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../js/firebase';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = await loginWithEmail(email, password);
            const token = await user.getIdToken();
            localStorage.setItem('buildora_token', token);
            localStorage.setItem('buildora_user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName
            }));
            navigate('/dashboard');
        } catch (err) {
            const messages = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password.',
                'auth/invalid-credential': 'Invalid email or password.',
                'auth/too-many-requests': 'Too many attempts. Try again later.',
                'auth/invalid-email': 'Invalid email address.'
            };
            setError(messages[err.code] || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
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
                setError('Google sign-in failed. Try again.');
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
                        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 700, marginTop: '16px' }}>Welcome Back</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Log in to access your projects and requests</p>
                    </div>

                    <button 
                        onClick={handleGoogleLogin}
                        className="btn-lg btn-full" 
                        style={{ marginBottom: '20px', background: '#fff', color: '#333', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '15px', fontWeight: 600, transition: 'all 0.3s ease' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                        Continue with Google
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>or sign in with email</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com" 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label htmlFor="password">Password</label>
                                <a href="#" style={{ fontSize: '13px', color: 'var(--primary-light)', textDecoration: 'none' }}>Forgot Password?</a>
                            </div>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••" 
                                required 
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div style={{ color: '#ef4444', fontSize: '14px', padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', marginTop: '8px' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary btn-lg btn-full" style={{ marginTop: '24px' }}>
                            {loading ? 'Signing In...' : 'Sign In to Dashboard'}
                        </button>
                        
                        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-secondary)', fontSize: '15px' }}>
                            Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none', borderBottom: '1px dashed var(--primary-light)' }}>Create Account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
