import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquarePlus, Users, Settings, Smartphone } from 'lucide-react';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <Smartphone size={32} color="#3b82f6" />
                <span>WaBulk</span>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
<<<<<<< HEAD
                    Dashboard
                </NavLink>
=======
                    Analytics Dashboard
                </NavLink>

                <NavLink to="/campaigns" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Smartphone size={20} />
                    Campaigns Library
                </NavLink>

>>>>>>> master
                <NavLink to="/create" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <MessageSquarePlus size={20} />
                    New Campaign
                </NavLink>

                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    Settings (QR App)
                </NavLink>
            </nav>
            <div className="system-status" style={{ marginTop: 'auto', padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>System Status</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                    <span style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>All Systems Operational</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
