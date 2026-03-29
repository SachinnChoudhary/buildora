import React from 'react';

const StatCard = ({ value, label, icon, colorClass }) => {
    return (
        <div className="stat-card">
            <div className={`stat-card-icon ${colorClass || 'purple'}`}>
                {icon}
            </div>
            <div className="stat-card-info">
                <span className="stat-card-value">{value}</span>
                <span className="stat-card-label">{label}</span>
            </div>
        </div>
    );
};

export default StatCard;
