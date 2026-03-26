import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { PlusCircle, Search, Filter, AppWindow } from 'lucide-react';
import { getAllCampaigns } from '../api';

const CampaignsList = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, sent: 0, delivered: 0, read: 0 });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const res = await getAllCampaigns();
            setCampaigns(res.data);

            let t = 0, s = 0, d = 0, r = 0;
            res.data.forEach(c => {
                t += c.totalContacts || 0;
                s += c.sentCount || 0;
                d += c.deliveredCount || 0;
                r += c.readCount || 0;
            });
            setStats({ total: t, sent: s, delivered: d, read: r });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Campaigns Library</h1>
                <Link to="/create" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', borderRadius: '12px', fontSize: '15px' }}>
                    <PlusCircle size={20} />
                    New Campaign
                </Link>
            </div>

            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="glass stat-card">
                    <div className="stat-label">Total Contacts</div>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="glass stat-card">
                    <div className="stat-label">Total Sent</div>
                    <div className="stat-value" style={{ color: 'var(--accent-color)' }}>{stats.sent}</div>
                </div>
                <div className="glass stat-card">
                    <div className="stat-label" style={{ color: '#ffeb3b' }}>Total Delivered</div>
                    <div className="stat-value" style={{ color: '#ffeb3b' }}>{stats.delivered}</div>
                </div>
                <div className="glass stat-card">
                    <div className="stat-label" style={{ color: 'var(--success-color)' }}>Total Read</div>
                    <div className="stat-value" style={{ color: 'var(--success-color)' }}>{stats.read}</div>
                </div>
            </div>

            <div className="glass" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>All Campaign Records</h2>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input type="text" placeholder="Search..." style={{ padding: '8px 12px 8px 36px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#fff', fontSize: '14px' }} />
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px' }}>Campaign Name</th>
                                <th style={{ textAlign: 'left', padding: '16px' }}>Status</th>
                                <th style={{ textAlign: 'center', padding: '16px' }}>Contacts</th>
                                <th style={{ textAlign: 'center', padding: '16px' }}>Success</th>
                                <th style={{ textAlign: 'left', padding: '16px' }}>Created Date</th>
                                <th style={{ textAlign: 'right', padding: '16px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.map(c => (
                                <tr key={c._id} style={{ borderTop: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ fontWeight: 600, color: '#fff' }}>{c.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>ID: {c._id.substring(c._id.length - 8).toUpperCase()}</div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span className={`badge badge-${c.status === 'completed' ? 'read' : c.status === 'sending' ? 'sent' : 'delivered'}`} style={{ fontSize: '12px', padding: '4px 10px' }}>
                                            {c.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{c.totalContacts || 0}</td>
                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                        <div style={{ color: 'var(--success-color)', fontWeight: 600 }}>{c.sentCount || 0}</div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>successful</div>
                                    </td>
                                    <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                                        {format(new Date(c.createdAt), 'MMM dd, yyyy HH:mm')}
                                    </td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>
                                        <Link to={`/campaign/${c._id}`} className="btn" style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '8px' }}>
                                            Open Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && <div style={{ textAlign: 'center', padding: '40px' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>}
                
                {!loading && campaigns.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
                        <PlusCircle size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                        <h3 style={{ color: '#fff' }}>No Campaigns Found</h3>
                        <p>Get started by creating your very first bulk messaging campaign.</p>
                        <Link to="/create" className="btn btn-primary" style={{ marginTop: '20px' }}>Create Campaign</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CampaignsList;
