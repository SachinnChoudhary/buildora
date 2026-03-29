import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import config from '../js/config';
import '../css/marketplace.css';

const MarketplacePage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorType, setErrorType] = useState(null); // 'NETWORK', 'SERVER', 'EMPTY'
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        setErrorType(null);
        try {
            const response = await fetch(`${config.API_BASE_URL}/api/projects/`);
            if (!response.ok) {
                if (response.status >= 500) {
                    throw new Error('SERVER_ERROR');
                } else {
                    throw new Error('API_ERROR');
                }
            }
            const data = await response.json();
            setProjects(data);
            if (data.length === 0) setErrorType('EMPTY');
        } catch (err) {
            console.error('Fetch error:', err);
            if (err.message === 'SERVER_ERROR') {
                setError('Our servers are having a moment. Please try again later.');
                setErrorType('SERVER');
            } else if (err.name === 'TypeError') {
                setError('Unable to connect to the server. Check your internet or backend status.');
                setErrorType('NETWORK');
            } else {
                setError('An unexpected error occurred while loading projects.');
                setErrorType('UNKNOWN');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.tech_stack.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = activeFilter === 'All' || p.domain === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const domains = ['All', 'Web', 'Mobile', 'AI/ML', 'Blockchain', 'Cybersecurity'];

    return (
        <div className="marketplace-container">
            <Sidebar activePage="marketplace" />
            
            <main className="marketplace-main">
                <TopBar onSearch={setSearchQuery} />

                <div className="marketplace-header">
                    <h1>Project Marketplace</h1>
                    <p>Discover high-quality engineering projects built by top students.</p>
                </div>

                <div className="filters-bar">
                    {domains.map(domain => (
                        <button 
                            key={domain}
                            className={`filter-chip ${activeFilter === domain ? 'active' : ''}`}
                            onClick={() => setActiveFilter(domain)}
                        >
                            {domain}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading projects...</p>
                    </div>
                ) : error ? (
                    <div className="error-container">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                            {errorType === 'NETWORK' ? '🌐' : '⚠️'}
                        </div>
                        <h2>{errorType === 'NETWORK' ? 'Network Error' : 'Oops! Something went wrong'}</h2>
                        <p style={{ color: '#888', maxWidth: '400px', margin: '1rem auto' }}>{error}</p>
                        <button className="retry-btn" onClick={fetchProjects}>Retry Connection</button>
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="error-container">
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h2>No projects found</h2>
                        <p style={{ color: '#888' }}>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {filteredProjects.map(project => (
                            <div key={project.id} className="project-card">
                                <div className="project-badge">{project.domain}</div>
                                <div className="project-img">
                                    {project.domain === 'Web' ? '🌐' : 
                                     project.domain === 'AI/ML' ? '🤖' : '💻'}
                                </div>
                                <h3 className="project-title">{project.title}</h3>
                                <p className="project-desc">{project.description.substring(0, 100)}...</p>
                                <div className="project-footer">
                                    <div className="project-price">₹{project.tier1_price}</div>
                                    <Link to={`/project/${project.id}`} className="view-btn">View Details</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MarketplacePage;
