import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../js/config';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import StatCard from '../components/dashboard/StatCard';
import ProjectItem from '../components/dashboard/ProjectItem';
import BuildoraAI from '../components/dashboard/BuildoraAI';

const DashboardPage = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                const token = await user.getIdToken();
                
                // Fetch Profile
                const profileRes = await fetch(`${API_BASE}/api/auth/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    setProfile(profileData);
                }

                // Fetch Orders
                const ordersRes = await fetch(`${API_BASE}/api/orders/my-orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }
            } catch (err) {
                console.error("Dashboard data fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className={`dashboard-body ${sidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Background elements to match legacy design */}
            <div className="hero-bg-grid"></div>
            <div className="hero-particles" id="heroParticles"></div>
            
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            <main className="main-content">
                <TopBar 
                    firstName={profile?.full_name?.split(' ')[0] || user?.displayName?.split(' ')[0]} 
                    toggleSidebar={toggleSidebar} 
                />

                <div className="dashboard-content">
                    {/* Stats Row */}
                    <div className="stats-row">
                        <StatCard 
                            value={orders.length} 
                            label="Projects" 
                            icon="📦" 
                            colorClass="purple" 
                        />
                        <StatCard 
                            value={orders.filter(o => o.status === 'active').length || 0} 
                            label="Active Builds" 
                            icon="⚡" 
                            colorClass="orange" 
                        />
                        <StatCard 
                            value={`₹${orders.reduce((acc, o) => acc + o.amount, 0)}`} 
                            label="Invested" 
                            icon="💰" 
                            colorClass="green" 
                        />
                         <StatCard 
                            value="38" 
                            label="AI Sessions" 
                            icon="🤖" 
                            colorClass="blue" 
                        />
                    </div>

                    {/* Main Grid */}
                    <div className="dashboard-grid">
                        {/* Project List Card */}
                        <div className="dash-card">
                            <div className="dash-card-header">
                                <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>My Projects</h2>
                                <a href="/marketplace" className="dash-card-action">Browse More →</a>
                            </div>
                            <div className="project-list">
                                {loading ? (
                                    <p style={{ padding: '20px', color: 'var(--text-muted)' }}>Loading projects...</p>
                                ) : orders.length === 0 ? (
                                    <p style={{ padding: '20px', color: 'var(--text-muted)' }}>You have not purchased any projects yet.</p>
                                ) : (
                                    orders.map((order, idx) => (
                                        <ProjectItem 
                                            key={order.id || idx}
                                            title={order.project_title}
                                            price={order.amount}
                                            colorClass={['purple-accent', 'orange-accent', 'green-accent', 'blue-accent'][idx % 4]}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        {/* BuildoraAI Card */}
                        <BuildoraAI />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
