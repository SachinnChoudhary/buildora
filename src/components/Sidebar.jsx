import React from 'react';
import { NavLink } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import '../css/style.css'; // Using global variables

const Sidebar = ({ activePage }) => {
    const auth = getAuth();
    
    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            await signOut(auth);
            window.location.href = '/login';
        }
    };

    return (
        <aside className="sidebar" style={{
            width: '260px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            position: 'sticky',
            top: 0,
            height: '100vh'
        }}>
            <div className="sidebar-logo" style={{ color: '#00d2ff', fontWeight: 800, fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: 'linear-gradient(45deg, #00d2ff, #3a7bd5)', padding: '5px 10px', borderRadius: '8px', color: '#000' }}>B</span>
                Buildora
            </div>

            <nav className="sidebar-nav" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={navItemStyle}>
                    🏠 Dashboard
                </NavLink>
                <NavLink to="/marketplace" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={navItemStyle}>
                    🛍️ Marketplace
                </NavLink>
                <NavLink to="/custom-request" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={navItemStyle}>
                    🛠️ Custom Request
                </NavLink>
                <div style={{ margin: '1rem 0', height: '1px', background: 'rgba(255,255,255,0.05)' }}></div>
                <NavLink to="/freelancer/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={navItemStyle}>
                    🚀 Sell Projects
                </NavLink>
            </nav>

            <button onClick={handleLogout} style={{
                marginTop: 'auto',
                padding: '1rem',
                background: 'rgba(255, 77, 77, 0.1)',
                color: '#ff4d4d',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 600,
                cursor: pointer,
                transition: '0.3s'
            }}>
                🚪 Logout
            </button>
            <style>{`
                .nav-item {
                    padding: 1rem;
                    border-radius: 12px;
                    color: #aaa;
                    text-decoration: none;
                    transition: 0.3s;
                    font-weight: 500;
                    display: block;
                }
                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                }
                .nav-item.active {
                    background: rgba(0, 210, 255, 0.1);
                    color: #00d2ff;
                    font-weight: 700;
                }
            `}</style>
        </aside>
    );
};

const navItemStyle = {}; // Placeholder since we use classNames

export default Sidebar;
