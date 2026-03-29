import React from 'react';
import { Link } from 'react-router-dom';
import '../css/landing.css';

const LandingPage = () => {
    return (
        <div className="landing-container">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-logo">Buildora.</div>
                <div className="nav-links">
                    <Link to="/marketplace">Marketplace</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/login" className="nav-btn">Login</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero">
                <h1 className="gradient-text">Unlock Your Future, One Project at a Time.</h1>
                <p>The premium marketplace for student-built projects. Buy, sell, and collaborate on world-class software developed by the next generation of engineers.</p>
                <div className="hero-btns">
                    <Link to="/signup" className="btn-primary">Get Started Free</Link>
                    <Link to="/marketplace" className="btn-secondary">Explore Projects</Link>
                </div>
            </header>

            {/* Bento Grid Features */}
            <section className="bento-grid">
                <div className="bento-item bento-1">
                    <div className="bento-icon">🚀</div>
                    <h3>Smart Matchmaking</h3>
                    <p>Our AI analyzes your skills and interests to find the perfect projects or collaborators for your next big venture.</p>
                </div>
                <div className="bento-item bento-2">
                    <div className="bento-icon">🛡️</div>
                    <h3>Verified Projects</h3>
                    <p>Every project on Buildora is code-reviewed for quality and security before being listed.</p>
                </div>
                <div className="bento-item bento-3">
                    <div className="bento-icon">💳</div>
                    <h3>Secure Payments</h3>
                    <p>Safe and transparent transactions handled with industry-standard encryption.</p>
                </div>
                <div className="bento-item bento-4">
                    <div className="bento-icon">🤝</div>
                    <h3>Expert Support</h3>
                    <p>Get 24/7 assistance from our community of moderators and expert developers.</p>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section style={{ padding: '0 5% 10rem', textAlign: 'center' }}>
                <div style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '30px', padding: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '2.5rem' }}>Empowering the Next Generation</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem' }}>
                        <div>
                            <h4 style={{ fontSize: '2.5rem', color: '#00d2ff' }}>1,200+</h4>
                            <p style={{ color: '#888' }}>Active Students</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '2.5rem', color: '#00d2ff' }}>450+</h4>
                            <p style={{ color: '#888' }}>Projects Sold</p>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '2.5rem', color: '#00d2ff' }}>₹20L+</h4>
                            <p style={{ color: '#888' }}>Scholarship Earned</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '5rem 5%', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.8)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
                    <div>
                        <div className="nav-logo" style={{ marginBottom: '1.5rem' }}>Buildora.</div>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>The world's leading marketplace for student engineering projects.</p>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem' }}>Platform</h4>
                        <ul style={{ listStyle: 'none', color: '#666', lineHeight: '2' }}>
                            <li>Marketplace</li>
                            <li>Custom Requests</li>
                            <li>Freelancing</li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ marginBottom: '1.5rem' }}>Legal</h4>
                        <ul style={{ listStyle: 'none', color: '#666', lineHeight: '2' }}>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Cookie Policy</li>
                        </ul>
                    </div>
                </div>
                <div style={{ marginTop: '5rem', textAlign: 'center', color: '#444', fontSize: '0.8rem' }}>
                    © 2026 Buildora Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
