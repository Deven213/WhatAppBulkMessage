import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { getWhatsAppStatus, logoutWhatsApp, BASE_URL } from '../api';

const SettingsPage = () => {
    const [status, setStatus] = useState('Checking...');
    const [qr, setQr] = useState(null);

    useEffect(() => {
        fetchStatus();
        const socket = io(BASE_URL);
        socket.on('whatsapp_qr', (qrCode) => { setQr(qrCode); setStatus('QR_READY'); });
        socket.on('whatsapp_ready', () => { setQr(null); setStatus('READY'); });
        socket.on('whatsapp_disconnected', () => setStatus('DISCONNECTED'));
        return () => socket.disconnect();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await getWhatsAppStatus();
            setStatus(res.data.status);
            if (res.data.qr) setQr(res.data.qr);
        } catch (err) {
            setStatus('SERVER_OFFLINE');
        }
    };

    const handleLogout = async () => {
        try {
            setStatus('DISCONNECTING...');
            await logoutWhatsApp();
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <div className="animate-fade-in" style={{ padding: '24px', maxWidth: '800px' }}>
            <h1 className="page-title">Connection Status</h1>

            <div className="glass" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', borderBottom: '1px solid var(--border-color)', paddingBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: status === 'READY' ? 'var(--wa-green)' : status === 'SERVER_OFFLINE' ? 'var(--danger-color)' : 'var(--warning-color)' }}></div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>Current State</p>
                            <h2 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{status.replace('_', ' ')}</h2>
                        </div>
                    </div>
                    {status === 'READY' && (
                        <button className="btn" style={{ background: '#f1f5f9', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} onClick={handleLogout}>
                            Disconnect Device
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                    {status === 'READY' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#16a34a', fontSize: '28px' }}>✓</div>
                            <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>WhatsApp Connected</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Your system is successfully linked and routing messages.</p>
                        </div>
                    )}

                    {status === 'QR_READY' && qr && (
                        <div style={{ textAlign: 'center' }}>
                            <div id="qr-container" style={{ background: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'inline-block', marginBottom: '16px', position: 'relative' }}>
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr)}&margin=0`} 
                                    alt="QR Code" 
                                    style={{ display: 'block', width: '200px', height: '200px' }} 
                                />
                            </div>
                            <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>Link a Device</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>Open WhatsApp on your phone and scan this code.</p>
                            
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <button 
                                    className="btn" 
                                    style={{ background: '#f1f5f9', fontSize: '0.9rem', padding: '8px 16px' }}
                                    onClick={() => {
                                        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
                                        navigator.clipboard.writeText(url);
                                        alert('QR Link copied to clipboard! You can share this link.');
                                    }}
                                >
                                    Copy Link
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                                    onClick={() => {
                                        const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qr)}`;
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = 'whatsapp_qr.png';
                                        link.target = '_blank';
                                        link.click();
                                    }}
                                >
                                    Download QR
                                </button>
                            </div>
                        </div>
                    )}

                    {status === 'DISCONNECTED' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#d97706', fontSize: '24px' }}>⚠</div>
                            <h3 style={{ margin: '0 0 16px', color: 'var(--text-primary)' }}>Device Disconnected</h3>
                            <button className="btn btn-primary" onClick={handleLogout}>Generate New Code</button>
                        </div>
                    )}

                    {status === 'DISCONNECTING...' && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p>Logging out safely...</p>
                        </div>
                    )}

                    {status === 'SERVER_OFFLINE' && (
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ margin: '0 0 8px', color: 'var(--danger-color)' }}>Backend Offline</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Please start the node server.</p>
                        </div>
                    )}

                    {status === 'Checking...' && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p>Connecting to backend...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
