import React from 'react';
import { Link } from 'react-router-dom';

const ProjectItem = ({ title, category, price, colorClass }) => {
    return (
        <Link to="/project-details" className="project-item">
            <div className={`project-item-color ${colorClass || 'purple-accent'}`}></div>
            <div className="project-item-info">
                <h3>{title}</h3>
                <div className="project-item-meta">
                    <span className={`tag-small ${colorClass?.split('-')[0] || 'purple'}`}>Purchased</span>
                    {price && <span className={`tag-small ${colorClass?.split('-')[0] || 'purple'}`}>₹{price}</span>}
                </div>
            </div>
            <div className="project-item-progress">
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary-light)' }}>ACCESS FILES</span>
            </div>
        </Link>
    );
};

export default ProjectItem;
