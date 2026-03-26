import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud } from 'lucide-react';

const ImportContacts = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchCampaigns = async () => {
            const res = await axios.get('http://localhost:5000/api/campaigns');
            const drafts = res.data.filter(c => c.status === 'draft');
            setCampaigns(drafts);
            if (drafts.length > 0) setSelectedCampaign(drafts[0]._id);
        };
        fetchCampaigns();
    }, []);

    const handleUpload = async () => {
        if (!file || !selectedCampaign) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(`http://localhost:5000/api/campaigns/${selectedCampaign}/upload-contacts`, formData);
            alert(`Success! ${res.data.count} contacts imported.`);
            setFile(null);
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <h1 className="page-title">Bulk Audience Import</h1>

            <div className="glass" style={{ padding: '32px', maxWidth: '600px' }}>
                <div className="form-group">
                    <label className="form-label">Select Campaign to Bind To</label>
                    <select
                        className="form-input"
                        value={selectedCampaign}
                        onChange={e => setSelectedCampaign(e.target.value)}
                    >
                        <option value="" disabled>-- Select a Draft Campaign --</option>
                        {campaigns.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                    {campaigns.length === 0 && <p style={{ color: 'var(--danger-color)', fontSize: '13px', marginTop: '8px' }}>No draft campaigns available. Create one first.</p>}
                </div>

                <div className="form-group" style={{ marginTop: '24px' }}>
                    <label className="form-label">Upload CSV / Excel File</label>
                    <div style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: '12px',
                        padding: '40px 20px',
                        textAlign: 'center',
                        background: 'var(--input-bg)',
                        transition: 'border-color 0.3s'
                    }}>
                        <UploadCloud size={48} color="var(--accent-color)" style={{ marginBottom: '16px' }} />
                        <p style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>Drag and drop or choose file to upload</p>
                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={e => setFile(e.target.files[0])}
                            style={{ marginBottom: '16px', color: 'var(--text-primary)' }}
                        />
                        <br />
                        <button className="btn btn-primary" onClick={handleUpload} disabled={!file || !selectedCampaign || uploading}>
                            {uploading ? 'Uploading...' : 'Import Data'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImportContacts;
