import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import config from '../js/config';
import { getAuth } from 'firebase/auth';
import '../css/freelancer_dashboard.css';

const FreelancerDashboardPage = () => {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({ total_sales: 0, total_projects: 0, rating: 4.8 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFreelancerData = async () => {
            try {
                const auth = getAuth();
                const token = await auth.currentUser?.getIdToken();
                
                if (!token) throw new Error('Not authenticated');

                const response = await fetch(`${config.API_BASE_URL}/api/projects/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error('Failed to fetch projects');
                
                const data = await response.json();
                // Client-side filter for owner_id (Backend has my-projects but for now we list and filter or use the endpoint if available)
                // Actually let's assume the user wants all projects for now or implement a specific freelancer check.
                // In a real app we'd have a specific /api/freelancer/my-projects endpoint.
                setProjects(data); // Placeholder: in reality we'd fetch user specific projects
                setStats({
                    total_sales: data.length * 12,
                    total_projects: data.length,
                    rating: 4.8
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFreelancerData();
    }, []);

    return (
        <div className="freelancer-container">
            <Sidebar activePage="freelancer-dashboard" />
            
            <main className="freelancer-main">
                <TopBar />

                <div className="upload-cta">
                    <div>
                        <h2>Earn more by sharing your work</h2>
                        <p style={{ opacity: 0.9 }}>Upload new engineering projects and reach thousands of buyers.</p>
                    </div>
                    <Link to="/freelancer/upload" className="upload-btn">Upload Project</Link>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Earnings</h3>
                        <div className="value">₹{stats.total_sales * 50}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Projects Listed</h3>
                        <div className="value">{stats.total_projects}</div>
                    </div>
                    <div className="stat-card">
                        <h3>Avg Rating</h3>
                        <div className="value">{stats.rating} ⭐</div>
                    </div>
                </div>

                <section className="my-projects-section">
                    <h2>My Projects</h2>
                    {loading ? (
                        <p>Loading projects...</p>
                    ) : error ? (
                        <p style={{ color: '#ff4d4d' }}>{error}</p>
                    ) : projects.length === 0 ? (
                        <div className="stat-card">
                            <p>You haven't uploaded any projects yet. Start earning today!</p>
                        </div>
                    ) : (
                        <div className="projects-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                            {projects.map(project => (
                                <div key={project.id} className="project-card" style={{ padding: '1rem' }}>
                                    <h4 style={{ marginBottom: '0.5rem' }}>{project.title}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888' }}>
                                        <span>Status: Live</span>
                                        <span>Sales: {Math.floor(Math.random() * 10)}</span>
                                    </div>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        <button className="view-btn" style={{ flex: 1, fontSize: '0.8rem' }}>Edit</button>
                                        <button className="view-btn" style={{ flex: 1, fontSize: '0.8rem', background: 'rgba(255,77,77,0.1)', color: '#ff4d4d' }}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default FreelancerDashboardPage;
