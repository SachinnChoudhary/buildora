import React from 'react';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ onSearch }) => {
    const { user } = useAuth();

    return (
        <header className="topbar" style={{
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '2rem',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="search-container" style={{ flex: 1, maxWidth: '500px' }}>
                {onSearch && (
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search projects, domains, or tech..." 
                            onChange={(e) => onSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem 0.8rem 2.5rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '0.9rem',
                                outline: 'none'
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="user-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div className="notifications" style={{ cursor: 'pointer', fontSize: '1.2rem', opacity: 0.7 }}>
                    🔔
                </div>
                <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}>
                    <div className="avatar" style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #7C3AED, #F97316)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '14px',
                        color: '#fff'
                    }}>
                        {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="name" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                        {user?.displayName || 'User'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopBar;
