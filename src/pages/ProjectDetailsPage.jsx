import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import config from '../js/config';
import '../css/project_details.css';

const ProjectDetailsPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/projects/${projectId}`);
                if (!response.ok) throw new Error('Project not found');
                const data = await response.json();
                setProject(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId]);

    if (loading) return (
        <div className="project-details-container">
            <Sidebar />
            <main className="project-details-main">
                <div className="loading-state">Loading project details...</div>
            </main>
        </div>
    );

    if (error || !project) return (
        <div className="project-details-container">
            <Sidebar />
            <main className="project-details-main">
                <div className="error-container">
                    <h2>Project Not Found</h2>
                    <p style={{ color: '#888', margin: '1rem 0' }}>The project you're looking for doesn't exist or has been removed.</p>
                    <Link to="/marketplace" className="view-btn">Back to Marketplace</Link>
                </div>
            </main>
        </div>
    );

    const techStack = project.tech_stack.split(',').map(s => s.trim());

    return (
        <div className="project-details-container">
            <Sidebar activePage="marketplace" />
            
            <main className="project-details-main">
                <TopBar />

                <div className="project-content">
                    <Link to="/marketplace" className="back-link">
                        ← Back to Marketplace
                    </Link>

                    <div className="project-hero">
                        <div className="project-info">
                            <span className="project-domain-tag">{project.domain}</span>
                            <h1>{project.title}</h1>
                            <p style={{ color: '#aaa', fontSize: '1.2rem' }}>
                                A professional {project.domain} project built with modern technologies.
                            </p>
                            
                            <div className="tech-stack-container">
                                {techStack.map(tech => (
                                    <span key={tech} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                        </div>

                        <div className="project-side-card">
                            <div className="price-tag">${project.tier1_price}</div>
                            <p style={{ color: '#888', fontSize: '0.9rem' }}>One-time payment for full source code and documentation.</p>
                            
                            <button 
                                className="buy-now-btn"
                                onClick={() => navigate(`/checkout/${project.id}`)}
                            >
                                Buy Project Now
                            </button>

                            <ul style={{ list-style: 'none', padding: 0, fontSize: '0.9rem', color: '#ccc' }}>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Full Source Code</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Setup Documentation</li>
                                <li style={{ marginBottom: '0.5rem' }}>✅ Developer Support</li>
                                <li>✅ MIT License</li>
                            </ul>
                        </div>
                    </div>

                    <div className="project-body">
                        <h2>Description</h2>
                        <p>{project.description}</p>
                        
                        <h2>Features</h2>
                        <ul style={{ marginLeft: '1.5rem', marginTop: '1rem' }}>
                            <li>Responsive UI/UX design</li>
                            <li>Clean and modular codebase</li>
                            <li>Easily customizable architecture</li>
                            <li>Comprehensive README and setup guide</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetailsPage;
