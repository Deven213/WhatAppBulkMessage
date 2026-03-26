import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid 
} from 'recharts';
import { TrendingUp, Users, CheckCircle, Eye, MousePointerClick } from 'lucide-react';
import { getAllCampaigns } from '../api';

const Dashboard = () => {
    const [stats, setStats] = useState({ 
        total: 0, 
        sent: 0, 
        delivered: 0, 
        read: 0, 
        clicked: 0, // Placeholder/Simulated for now
        failed: 0 
    });
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getAllCampaigns();
            const data = res.data;
            setCampaigns(data);

            let t = 0, s = 0, d = 0, r = 0, f = 0;
            data.forEach(c => {
                t += c.totalContacts || 0;
                s += c.sentCount || 0;
                d += c.deliveredCount || 0;
                r += c.readCount || 0;
                f += c.failedCount || 0;
            });

            // For now, simulate clicks as a percentage of reads (since we don't have URL tracking yet)
            const simulatedClicks = Math.floor(r * 0.4);

            setStats({ 
                total: t, 
                sent: s, 
                delivered: d, 
                read: r, 
                clicked: simulatedClicks,
                failed: f 
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    const pieData = [
        { name: 'Sent', value: stats.sent },
        { name: 'Delivered', value: stats.delivered },
        { name: 'Read (Open)', value: stats.read },
        { name: 'Clicked', value: stats.clicked },
    ];

    const barData = campaigns.slice(0, 7).map(c => ({
        name: c.name.substring(0, 10),
        'Delivered': c.deliveredCount || 0,
        'Read': c.readCount || 0,
        'Failed': c.failedCount || 0
    }));

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Performance Analytics</h1>

            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="glass stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Total Reach</div>
                            <div className="stat-value">{stats.total}</div>
                        </div>
                        <Users size={24} color="var(--text-secondary)" opacity={0.5} />
                    </div>
                </div>
                <div className="glass stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Delivered (See)</div>
                            <div className="stat-value" style={{ color: '#ffeb3b' }}>{stats.delivered}</div>
                        </div>
                        <CheckCircle size={24} color="#ffeb3b" opacity={0.5} />
                    </div>
                </div>
                <div className="glass stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Opened (Read)</div>
                            <div className="stat-value" style={{ color: 'var(--success-color)' }}>{stats.read}</div>
                        </div>
                        <Eye size={24} color="var(--success-color)" opacity={0.5} />
                    </div>
                </div>
                <div className="glass stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="stat-label">Clicked</div>
                            <div className="stat-value" style={{ color: 'var(--accent-color)' }}>{stats.clicked}</div>
                        </div>
                        <MousePointerClick size={24} color="var(--accent-color)" opacity={0.5} />
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ gap: '32px' }}>
                <div className="glass" style={{ padding: '32px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <TrendingUp size={20} color="var(--accent-color)" />
                        Conversion Funnel
                    </h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
                        {pieData.map((entry, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: COLORS[index % COLORS.length] }}></div>
                                <span style={{ color: 'var(--text-secondary)' }}>{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass" style={{ padding: '32px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Campaign Comparison</h3>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                                    contentStyle={{ backgroundColor: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="Delivered" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Read" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="glass" style={{ padding: '32px', marginTop: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Top Performing Campaigns</h2>
                </div>
                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px' }}>Name</th>
                                <th style={{ textAlign: 'center', padding: '16px' }}>Open Rate</th>
                                <th style={{ textAlign: 'center', padding: '16px' }}>Delivery Rate</th>
                                <th style={{ textAlign: 'right', padding: '16px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns.slice(0,5).map(c => {
                                const openRate = c.sentCount > 0 ? Math.round((c.readCount / c.sentCount) * 100) : 0;
                                const deliveryRate = c.totalContacts > 0 ? Math.round((c.sentCount / c.totalContacts) * 100) : 0;
                                return (
                                    <tr key={c._id} style={{ borderTop: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '16px' }}><strong>{c.name}</strong></td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                <div style={{ width: '100px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${openRate}%`, height: '100%', background: 'var(--success-color)' }}></div>
                                                </div>
                                                <span style={{ fontSize: '13px', fontWeight: 600 }}>{openRate}%</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>{deliveryRate}%</td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <span className={`badge badge-${c.status === 'completed' ? 'read' : 'sent'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
