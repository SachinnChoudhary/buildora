import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    
    // Fallback initials
    const initials = (user?.displayName || user?.email || '?')
        .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
            <div className="sidebar-header">
                <Link to="/" className="nav-logo">
                    <img src="/src/assets/buildora-logo.svg" alt="Buildora" className="logo-img" style={{ width: '32px', height: '32px' }} />
                    <span className="logo-text">&lt;Buildora/&gt;</span>
                </Link>
                <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
            </div>
            <nav className="sidebar-nav">
                <div className="nav-section">
                    <span className="nav-section-label">Main</span>
                    <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/marketplace" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                        <span>Marketplace</span>
                    </NavLink>
                    <NavLink to="/purchases" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                        <span>My Purchases</span>
                    </NavLink>
                    <NavLink to="/custom-request" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        <span>Custom Requests</span>
                    </NavLink>
                </div>
                <div className="nav-section">
                    <span className="nav-section-label">Tools</span>
                    <a href="#" className="sidebar-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 110 20 10 10 0 010-20z"/><path d="M12 8v4l3 3"/></svg>
                        <span>BuildoraAI</span>
                        <span className="sidebar-badge">New</span>
                    </a>
                </div>
            </nav>
            <div className="sidebar-user">
                <div className="user-avatar">{initials}</div>
                <div className="user-info">
                    <span className="user-name">{user?.displayName || 'User'}</span>
                    <span className="user-role">{user?.email}</span>
                </div>
                <button onClick={logout} title="Log out" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', marginLeft: 'auto' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
