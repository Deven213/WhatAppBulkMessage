import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UploadCloud, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react';
=======
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { UploadCloud, Play, CheckCircle, Smartphone, Users, MessageSquare, BarChart3, ArrowLeft, ArrowRight, Save } from 'lucide-react';
>>>>>>> master
import {
    getCampaignById,
    uploadContacts,
    sendCampaign,
    duplicateCampaign,
<<<<<<< HEAD
=======
    updateCampaign,
>>>>>>> master
    BASE_URL,
} from '../api';

const CampaignDetails = () => {
    const { id } = useParams();
<<<<<<< HEAD
=======
    const navigate = useNavigate();
>>>>>>> master
    const [campaign, setCampaign] = useState(null);
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [sending, setSending] = useState(false);
<<<<<<< HEAD
=======
    const [activeStep, setActiveStep] = useState(1);
    
    // Editable state for Step 1
    const [editedName, setEditedName] = useState('');
    const [editedTemplate, setEditedTemplate] = useState('');
    const [saving, setSaving] = useState(false);
>>>>>>> master

    useEffect(() => {
        fetchData();

        const socket = io(BASE_URL);
        socket.on('campaign_update', (updatedCampaign) => {
            if (updatedCampaign._id === id) {
                setCampaign(updatedCampaign);
                fetchMessages();
            }
        });

        return () => socket.disconnect();
    }, [id]);

<<<<<<< HEAD
=======
    useEffect(() => {
        if (campaign) {
            setEditedName(campaign.name);
            setEditedTemplate(campaign.messageTemplate);
            // Default to Step 3 if already sending or completed
            if (campaign.status !== 'draft') {
                setActiveStep(3);
            }
        }
    }, [campaign]);

>>>>>>> master
    const fetchData = async () => {
        try {
            const res = await getCampaignById(id);
            setCampaign(res.data.campaign);
            setContacts(res.data.contacts);
            setMessages(res.data.messages);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await getCampaignById(id);
            setMessages(res.data.messages);
        } catch (err) {}
    };

<<<<<<< HEAD
=======
    const handleUpdate = async () => {
        setSaving(true);
        try {
            await updateCampaign(id, { name: editedName, messageTemplate: editedTemplate });
            setCampaign({ ...campaign, name: editedName, messageTemplate: editedTemplate });
            alert('Campaign updated successfully');
        } catch (err) {
            alert('Failed to update campaign');
        } finally {
            setSaving(false);
        }
    };

>>>>>>> master
    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await uploadContacts(id, formData);
            alert('Contacts imported successfully');
            setFile(null);
            fetchData();
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const startCampaign = async (force = false) => {
        setSending(true);
        try {
            await sendCampaign(id, force);
<<<<<<< HEAD
            alert(force ? 'Campaign forcibly restarted!' : 'Campaign started!');
            if (force) window.location.reload();
=======
            setActiveStep(3); // Move to results step
>>>>>>> master
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to start campaign');
            setSending(false);
        }
    };

<<<<<<< HEAD
    if (!campaign) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>{campaign.name}</h1>
                <span className={`badge badge-${campaign.status === 'completed' ? 'read' : campaign.status === 'sending' ? 'sent' : 'delivered'}`} style={{ fontSize: '14px', padding: '6px 16px' }}>
                    {campaign.status}
                </span>
            </div>

            <div className="grid-2" style={{ marginBottom: '32px' }}>
                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Campaign Stats</h3>
                    <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                            <div className="stat-label">Total Contacts</div>
                            <div className="stat-value" style={{ fontSize: '28px' }}>{campaign.totalContacts}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                            <div className="stat-label text-accent">Sent</div>
                            <div className="stat-value" style={{ fontSize: '28px', color: 'var(--accent-color)' }}>{campaign.sentCount}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                            <div className="stat-label text-success">Read</div>
                            <div className="stat-value" style={{ fontSize: '28px', color: 'var(--success-color)' }}>{campaign.readCount}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px' }}>
                            <div className="stat-label text-danger">Failed</div>
                            <div className="stat-value" style={{ fontSize: '28px', color: 'var(--danger-color)' }}>{campaign.failedCount}</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>Actions</h4>
                        {campaign.status !== 'sending' && (
                            <button
                                className="btn btn-success"
                                onClick={async () => {
                                    if (campaign.status === 'completed') {
                                        setSending(true);
                                        try {
                                            const res = await duplicateCampaign(id);
                                            alert('Campaign copied! Redirecting...');
                                            window.location.href = `/campaign/${res.data._id}`;
                                        } catch (err) {
                                            alert(err.response?.data?.error || 'Failed to copy campaign');
                                            setSending(false);
                                        }
                                    } else {
                                        startCampaign(false);
                                    }
                                }}
                                disabled={sending || contacts.length === 0}
                                style={{ width: '100%' }}
                            >
                                <Play size={18} />
                                {campaign.status === 'completed' ? 'Duplicate & Resend Campaign' : 'Start Sending Campaign'}
                            </button>
                        )}
                        {campaign.status === 'sending' && (
                            <>
                                <button className="btn" disabled style={{ width: '100%', background: '#f1f5f9', color: 'var(--text-secondary)' }}>
                                    <div className="loader" style={{ borderColor: 'rgba(0,0,0,0.1)', borderLeftColor: 'var(--text-secondary)' }}></div>
                                    Sending in progress...
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => startCampaign(true)}
                                    style={{ width: '100%', marginTop: '12px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                                >
                                    Force Restart (If Stuck)
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="glass" style={{ padding: '24px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Upload Contacts (Excel/CSV)</h3>

                    <div style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: '12px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        background: 'rgba(0,0,0,0.2)',
                        transition: 'border-color 0.3s'
                    }}>
                        <UploadCloud size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
                        <p style={{ marginBottom: '16px' }}>Drag and drop or choose file to upload</p>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={e => setFile(e.target.files[0])}
                            style={{ marginBottom: '16px' }}
                        />
                        <br />
                        <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
                            {uploading ? 'Uploading...' : 'Import Data'}
                        </button>
                    </div>

                    <div style={{ marginTop: '24px' }}>
                        <h4 style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>Sample Preview ({contacts.length} Contacts)</h4>
                        <div style={{ maxHeight: '120px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px' }}>
                            {contacts.slice(0, 3).map((c, i) => (
                                <div key={i} style={{ padding: '8px', borderBottom: '1px solid var(--border-color)', fontSize: '14px' }}>
                                    <strong>{c.name || 'No Name'}</strong> - {c.phone}
                                </div>
                            ))}
                            {contacts.length === 0 && <p style={{ margin: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>No contacts uploaded yet.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass" style={{ padding: '24px' }}>
                <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Message Logs</h3>
                <div className="table-responsive">
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Sent At</th>
                                <th>Read At</th>
                                <th>Error</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(m => (
                                <tr key={m._id}>
                                    <td>{m.phone}</td>
                                    <td>
                                        <span className={`badge badge-${m.status === 'pending' ? 'delivered' : m.status}`}>
                                            {m.status}
                                        </span>
                                    </td>
                                    <td>{m.sentAt ? new Date(m.sentAt).toLocaleTimeString() : '-'}</td>
                                    <td>{m.readAt ? new Date(m.readAt).toLocaleTimeString() : '-'}</td>
                                    <td style={{ color: 'var(--danger-color)' }}>{m.failedReason || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {messages.length === 0 && <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-secondary)' }}>No messages sent yet.</p>}
            </div>
=======
    if (!campaign) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="loader" style={{ width: '40px', height: '40px' }}></div>
            <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>Loading Campaign Details...</p>
        </div>
    );

    const steps = [
        { id: 1, label: 'Message Setup', icon: <MessageSquare size={20} /> },
        { id: 2, label: 'Audience Import', icon: <Users size={20} /> },
        { id: 3, label: 'Execution & Results', icon: <BarChart3 size={20} /> }
    ];

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div>
                    <button onClick={() => navigate('/campaigns')} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px', padding: 0 }}>
                        <ArrowLeft size={16} /> Back to Library
                    </button>
                    <h1 className="page-title" style={{ marginBottom: 0 }}>{campaign.name}</h1>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${campaign.status === 'completed' ? 'read' : campaign.status === 'sending' ? 'sent' : 'delivered'}`} style={{ fontSize: '14px', padding: '6px 16px', display: 'inline-block', marginBottom: '8px' }}>
                        {campaign.status.toUpperCase()}
                    </span>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Created: {new Date(campaign.createdAt).toLocaleDateString()}</div>
                </div>
            </div>

            {/* Stepper Navigation */}
            <div style={{ display: 'flex', background: 'var(--panel-bg)', padding: '4px', borderRadius: '12px', marginBottom: '32px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
                {steps.map(s => (
                    <button 
                        key={s.id}
                        onClick={() => setActiveStep(s.id)}
                        style={{
                            flex: 1,
                            minWidth: '160px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '14px',
                            border: 'none',
                            borderRadius: '10px',
                            background: activeStep === s.id ? 'var(--accent-color)' : 'transparent',
                            color: activeStep === s.id ? '#fff' : 'var(--text-secondary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        {s.icon}
                        {s.label}
                    </button>
                ))}
            </div>

            {/* Step 1: Message Config */}
            {activeStep === 1 && (
                <div className="glass animate-fade-in" style={{ padding: '32px' }}>
                    <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Edit Message Configuration</h2>
                    <div className="form-group">
                        <label className="form-label">Campaign Name</label>
                        <input type="text" className="form-input" value={editedName} onChange={e => setEditedName(e.target.value)} disabled={campaign.status !== 'draft'} />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Message Template</label>
                        <textarea className="form-textarea" value={editedTemplate} onChange={e => setEditedTemplate(e.target.value)} rows={8} disabled={campaign.status !== 'draft'} />
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                            You can only edit templates for draft campaigns. To redo a completed campaign, use the "Duplicate" feature.
                        </p>
                    </div>
                    {campaign.status === 'draft' && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                            <button className="btn btn-primary" onClick={handleUpdate} disabled={saving} style={{ padding: '12px 32px' }}>
                                {saving ? <div className="loader"></div> : <><Save size={18} /> Save Changes</>}
                            </button>
                            <button className="btn btn-primary" onClick={() => setActiveStep(2)} style={{ padding: '12px 32px', background: 'var(--success-color)' }}>
                                Next: Audience <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Audience Import */}
            {activeStep === 2 && (
                <div className="grid-2 animate-fade-in">
                    <div className="glass" style={{ padding: '32px' }}>
                        <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Audience Management</h2>
                        <div style={{
                            border: '2px dashed var(--border-color)',
                            borderRadius: '12px',
                            padding: '40px 20px',
                            textAlign: 'center',
                            background: 'rgba(0,0,0,0.02)',
                            marginBottom: '24px'
                        }}>
                            <UploadCloud size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
                            <p style={{ marginBottom: '16px', fontWeight: 500 }}>Upload Excel/CSV to append/replace contacts</p>
                            <input type="file" accept=".xlsx,.xls,.csv" onChange={e => setFile(e.target.files[0])} style={{ marginBottom: '16px' }} />
                            <br />
                            <button className="btn btn-primary" onClick={handleUpload} disabled={!file || uploading}>
                                {uploading ? <div className="loader"></div> : 'Start Import'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button className="btn" onClick={() => setActiveStep(1)} style={{ background: '#f1f5f9' }}>Back</button>
                            <button className="btn btn-primary" onClick={() => setActiveStep(3)} style={{ background: 'var(--success-color)' }}>Review & Launch <ArrowRight size={18} /></button>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '32px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Imported List ({contacts.length} Records)</h3>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {contacts.map((c, i) => (
                                <div key={i} style={{ padding: '12px', borderBottom: '1px solid var(--border-color)', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span><strong>{c.name || 'User'}</strong></span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{c.phone}</span>
                                </div>
                            ))}
                            {contacts.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No contacts imported yet</div>}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Execution & Results */}
            {activeStep === 3 && (
                <div className="animate-fade-in">
                    <div className="grid-2" style={{ marginBottom: '32px' }}>
                        <div className="glass" style={{ padding: '32px' }}>
                            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Dispatch Control</h2>
                            
                            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                                    <div className="stat-label">Delivered</div>
                                    <div className="stat-value" style={{ color: '#ef4444' }}>{campaign.deliveredCount}</div>
                                </div>
                                <div style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                                    <div className="stat-label">Read (Opens)</div>
                                    <div className="stat-value" style={{ color: 'var(--success-color)' }}>{campaign.readCount}</div>
                                </div>
                            </div>

                            {campaign.status !== 'sending' ? (
                                <button
                                    className="btn btn-success"
                                    onClick={async () => {
                                        if (campaign.status === 'completed') {
                                            setSending(true);
                                            try {
                                                const res = await duplicateCampaign(id);
                                                window.location.href = `/campaign/${res.data._id}`;
                                            } catch (err) { alert('Failed to duplicate'); setSending(false); }
                                        } else {
                                            startCampaign(false);
                                        }
                                    }}
                                    disabled={sending || contacts.length === 0}
                                    style={{ width: '100%', padding: '16px', fontSize: '16px' }}
                                >
                                    <Play size={20} />
                                    {campaign.status === 'completed' ? 'Duplicate & Launch Again' : 'LAUNCH CAMPAIGN NOW'}
                                </button>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div className="glass" style={{ padding: '20px', background: '#f1f5f9', textAlign: 'center' }}>
                                        <div className="loader" style={{ marginBottom: '12px' }}></div>
                                        <div style={{ fontWeight: 600 }}>Sending Campaign...</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status: {campaign.sentCount} / {campaign.totalContacts} processed</div>
                                    </div>
                                    <button className="btn" onClick={() => startCampaign(true)} style={{ color: '#dc2626', border: '1px solid #dc2626' }}>Force Restart</button>
                                </div>
                            )}
                        </div>

                        <div className="glass" style={{ padding: '32px' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Configuration Overlook</h3>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontWeight: 600, marginBottom: '8px' }}>Template:</div>
                                <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', maxHeight: '150px', overflowY: 'auto', color: 'var(--text-secondary)' }}>
                                    {campaign.messageTemplate}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '14px' }}>
                                <span>Total Audience:</span>
                                <strong>{campaign.totalContacts} Contacts</strong>
                            </div>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '32px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Live Transmission Logs</h3>
                        <div className="table-responsive">
                            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th style={{ padding: '12px' }}>Phone</th>
                                        <th style={{ padding: '12px' }}>Result</th>
                                        <th style={{ padding: '12px' }}>Delivered</th>
                                        <th style={{ padding: '12px' }}>Opened</th>
                                        <th style={{ padding: '12px' }}>Error Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {messages.map(m => (
                                        <tr key={m._id} style={{ borderTop: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '12px' }}>{m.phone}</td>
                                            <td style={{ padding: '12px' }}>
                                                <span className={`badge badge-${m.status === 'pending' ? 'delivered' : m.status}`} style={{ fontSize: '11px' }}>
                                                    {m.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>{m.deliveredAt ? new Date(m.deliveredAt).toLocaleTimeString() : '-'}</td>
                                            <td style={{ padding: '12px' }}>{m.readAt ? new Date(m.readAt).toLocaleTimeString() : '-'}</td>
                                            <td style={{ padding: '12px', color: 'var(--danger-color)', fontSize: '12px' }}>{m.failedReason || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {messages.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No transmission history yet.</div>}
                    </div>
                </div>
            )}
>>>>>>> master
        </div>
    );
};

export default CampaignDetails;
