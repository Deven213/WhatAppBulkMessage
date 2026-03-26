import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Play, ArrowRight, Check } from 'lucide-react';
<<<<<<< HEAD
import { createCampaign, uploadContacts, sendCampaign } from '../api';
=======
import { createCampaign, uploadContacts, sendCampaign, getCampaignById } from '../api';
>>>>>>> master

const PREDEFINED_TEMPLATES = [
    { id: 'welcome', label: 'Welcome/Onboarding', text: "Hello {{name}}! 👋\n\nWelcome to our platform. We are thrilled to have you here. Let us know if you need any help getting started!" },
    { id: 'promo', label: 'Product Promo', text: "Hi {{name}}, 🛒\n\nDon't miss out on our special limited-time offer for the {{product}}! \n\nGrab it now before it's gone: {{link}}" },
    { id: 'reminder', label: 'Event/Webinar Reminder', text: "Hi {{name}} 📅,\n\nJust a quick reminder that our upcoming webinar on the {{topic}} is starting soon.\n\nJoin us here: {{link}}" },
    { id: 'abandoned', label: 'Abandoned Cart', text: "Hey {{name}},\n\nWe noticed you left some great items in your cart! 🛍️\n\nComplete your purchase using this link: {{link}}\n\nUse code SAVE10 for 10% off!" }
];

const CreateCampaign = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Step 1
    const [name, setName] = useState('');
    const [template, setTemplate] = useState('Hello {{name}},\n\nWelcome to our platform!');
    const [campaignId, setCampaignId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Step 2
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
<<<<<<< HEAD

    // Step 3
    const [sending, setSending] = useState(false);
=======
    const [importedCount, setImportedCount] = useState(0);

    // Step 3
    const [sending, setSending] = useState(false);
    const [sampleContacts, setSampleContacts] = useState([]);

    const fetchSampleContacts = async (id) => {
        try {
            const res = await getCampaignById(id);
            setSampleContacts(res.data.contacts.slice(0, 5));
        } catch (err) {}
    };
>>>>>>> master

    const parseTemplate = (text) => {
        return text
            .replace(/{{name}}/gi, 'Deven')
            .replace(/{{product}}/gi, 'Pro Plan')
            .replace(/{{link}}/gi, 'https://example.com')
            .replace(/{{topic}}/gi, 'Growth Marketing Strategies')
            .replace(/{{[a-zA-Z0-9_]+}}/g, 'SampleData');
    };

    const loadTemplate = (id) => {
        const found = PREDEFINED_TEMPLATES.find(t => t.id === id);
        if (found) setTemplate(found.text);
    };

    const handleStep1 = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createCampaign({ name, messageTemplate: template });
            setCampaignId(res.data._id);
            setStep(2);
        } catch (err) {
            alert(err.response?.data?.error || 'Error creating campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleStep2 = async () => {
        if (!file) {
            setStep(3);
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
<<<<<<< HEAD
            await uploadContacts(campaignId, formData);
=======
            const res = await uploadContacts(campaignId, formData);
            setImportedCount(res.data.count);
            fetchSampleContacts(campaignId);
>>>>>>> master
            setStep(3);
        } catch (err) {
            alert(err.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleStep3 = async () => {
        setSending(true);
        try {
            await sendCampaign(campaignId, false);
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to trigger send process directly. Redirecting to details panel.');
        } finally {
            setSending(false);
            navigate(`/campaign/${campaignId}`);
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">New Campaign Wizard</h1>

            {/* Stepper Header */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
                <div style={{ flex: 1, minWidth: '150px', padding: '12px 16px', background: step >= 1 ? 'var(--accent-color)' : '#f1f5f9', color: step >= 1 ? '#fff' : 'var(--text-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: step > 1 ? '#10b981' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{step > 1 ? <Check size={14} /> : '1'}</div>
                    Setup Message
                </div>
                <div style={{ flex: 1, minWidth: '150px', padding: '12px 16px', background: step >= 2 ? 'var(--accent-color)' : '#f1f5f9', color: step >= 2 ? '#fff' : 'var(--text-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: step > 2 ? '#10b981' : 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{step > 2 ? <Check size={14} /> : '2'}</div>
                    Import Contacts
                </div>
                <div style={{ flex: 1, minWidth: '150px', padding: '12px 16px', background: step >= 3 ? 'var(--accent-color)' : '#f1f5f9', color: step >= 3 ? '#fff' : 'var(--text-secondary)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</div>
                    Review & Send
                </div>
            </div>

            <div className="grid-2">
                {/* Dynamic Content based on Step */}
                <div className="glass" style={{ padding: '32px' }}>
                    {step === 1 && (
                        <form onSubmit={handleStep1} className="animate-fade-in">
                            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Campaign Details</h2>
                            <div className="form-group">
                                <label className="form-label">Campaign Name</label>
                                <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Black Friday Sale 2026" required />
                            </div>

                            <div className="form-group" style={{ marginBottom: '16px' }}>
                                <label className="form-label">Load Quick Template</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {PREDEFINED_TEMPLATES.map(t => (
                                        <button type="button" key={t.id} onClick={() => loadTemplate(t.id)} className="btn" style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message Payload</label>
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '-4px', marginBottom: '12px' }}>
                                    Use variables like {'{{name}}'}, {'{{product}}'}. They must exactly match the column headers in your imported file.
                                </p>
                                <textarea className="form-textarea" value={template} onChange={e => setTemplate(e.target.value)} required rows={6} />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                                {loading ? <div className="loader"></div> : <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Proceed to Contact Import <ArrowRight size={18} /></span>}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 style={{ marginTop: 0, marginBottom: '24px' }}>Upload Audience Database</h2>
                            <div style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: '12px',
                                padding: '40px 20px',
                                textAlign: 'center',
                                background: '#f8fafc',
                                transition: 'border-color 0.3s',
                                marginBottom: '24px'
                            }}>
                                <UploadCloud size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
                                <p style={{ marginBottom: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>Select Excel or CSV File</p>
                                <input type="file" accept=".xlsx,.xls,.csv" onChange={e => setFile(e.target.files[0])} style={{ marginBottom: '8px', maxWidth: '100%' }} />
                                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>Ensure your file has a 'Phone' or 'Number' column.</p>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button className="btn" onClick={() => setStep(1)} style={{ flex: 1, background: '#f1f5f9', color: 'var(--text-primary)' }}>Back</button>
                                <button className="btn btn-primary" onClick={handleStep2} disabled={uploading} style={{ flex: 2 }}>
                                    {uploading ? <div className="loader"></div> : <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{file ? 'Import Data & Continue' : 'Skip & Continue'} <ArrowRight size={18} /></span>}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
<<<<<<< HEAD
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                <Play fill="#10b981" color="#10b981" size={40} style={{ marginLeft: '6px' }} />
                            </div>
                            <h2 style={{ margin: '0 0 12px 0' }}>Ready for Liftoff!</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your campaign '{name}' is fully drafted and ready to be dispatched to your imported contacts.</p>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button className="btn" onClick={() => setStep(2)} style={{ flex: 1, background: '#f1f5f9', color: 'var(--text-primary)' }}>Back</button>
                                <button className="btn btn-success" onClick={handleStep3} disabled={sending} style={{ flex: 2, padding: '16px' }}>
                                    {sending ? <div className="loader"></div> : <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>START CAMPAIGN <Play size={18} /></span>}
                                </button>
                            </div>
=======
                        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '10px auto 24px' }}>
                                <Play fill="#10b981" color="#10b981" size={40} style={{ marginLeft: '6px' }} />
                            </div>
                            <h2 style={{ margin: '0 0 12px 0' }}>Ready for Liftoff!</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Your campaign '{name}' is fully drafted and ready to be dispatched.</p>
                            
                            <div className="glass" style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '32px', textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontWeight: 600 }}>Message Template:</span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{template.length} chars</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
                                    {template}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                                    <span>Target Audience:</span>
                                    <span style={{ color: 'var(--success-color)' }}>{importedCount} Contacts Found</span>
                                </div>
                                {sampleContacts.length > 0 && (
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px border var(--border-color)' }}>
                                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Audience Preview</p>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {sampleContacts.map((c, i) => (
                                                <div key={i} style={{ background: 'rgba(255,255,255,0.7)', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', border: '1px solid var(--border-color)' }}>
                                                    {c.name || 'User'} ({c.phone})
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button className="btn" onClick={() => setStep(2)} style={{ flex: 1, background: '#f1f5f9', color: 'var(--text-primary)' }}>Back & Re-upload</button>
                                <button className="btn btn-success" onClick={handleStep3} disabled={sending || importedCount === 0} style={{ flex: 2, padding: '16px' }}>
                                    {sending ? <div className="loader"></div> : <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>LAUNCH NOW <Play size={18} /></span>}
                                </button>
                            </div>
                            {importedCount === 0 && <p style={{ color: 'var(--danger-color)', fontSize: '13px', marginTop: '12px' }}>Please go back and upload contacts first.</p>}
>>>>>>> master
                        </div>
                    )}
                </div>

                {/* Persistent Sidebar (Live Mobile Preview) */}
                <div>
                    <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Live Mobile Preview</h3>
                    <div className="wa-preview-container">
                        <div className="wa-status-bar">
                            <span>19:30</span>
                            <div style={{ display: 'flex', gap: '4px', letterSpacing: '1px' }}>
                                <span>📶</span>
                                <span>🔋</span>
                            </div>
                        </div>
                        <div className="wa-preview-header">
                            <span style={{ fontSize: '20px', cursor: 'pointer', marginRight: '-4px' }}>←</span>
                            <div style={{ width: '36px', height: '36px', background: '#ccc', borderRadius: '50%', backgroundImage: 'url("https://i.pravatar.cc/100?img=11")', backgroundSize: 'cover' }}></div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '15.5px', fontWeight: '500', lineHeight: '1.2' }}>Sample User</div>
                                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>online</div>
                            </div>
                            <span style={{ fontSize: '18px', display: 'flex', gap: '16px', marginRight: '4px' }}>
                                📷 📞 ⋮
                            </span>
                        </div>
                        <div className="wa-preview-body">
                            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                <span style={{ background: '#E1F3FB', color: '#54656f', fontSize: '12px', padding: '4px 12px', borderRadius: '8px', display: 'inline-block' }}>TODAY</span>
                            </div>
                            <div className="wa-bubble">
                                {parseTemplate(template)}
                                <div className="wa-timestamp">
                                    <span>19:30</span>
                                    <span style={{ color: '#53bdeb', fontSize: '14px', letterSpacing: '-2px', marginLeft: '4px' }}>✓✓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCampaign;
