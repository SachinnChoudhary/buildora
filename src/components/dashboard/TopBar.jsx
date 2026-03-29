import React from 'react';

const TopBar = ({ firstName, toggleSidebar }) => {
    return (
        <header className="topbar">
            <div className="topbar-left">
                <button className="mobile-sidebar-btn" onClick={toggleSidebar} aria-label="Open sidebar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
                <div className="topbar-greeting">
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                        Welcome back, <span className="gradient-text">{firstName || 'User'}</span>! 👋
                    </h1>
                    <p>Here's what's happening with your projects today.</p>
                </div>
            </div>
            <div className="topbar-right">
                <div className="search-box glass-card">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                    <input type="text" placeholder="Search projects..." />
                    <kbd>/</kbd>
                </div>
                <button className="icon-btn glass-card" aria-label="Notifications">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                    <span className="notif-dot"></span>
                </button>
            </div>
        </header>
    );
};

export default TopBar;
