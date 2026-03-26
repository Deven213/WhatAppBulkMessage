/**
 * Centralized API configuration and service layer.
 * All backend calls are routed through this file.
 * Base URL points to the deployed Render backend.
 */

import axios from 'axios';

// ─── Base URL ───────────────────────────────────────────────────────────────
<<<<<<< HEAD
export const BASE_URL = 'https://whatappbulkmessage.onrender.com';
=======
export const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://whatappbulkmessage.onrender.com';
>>>>>>> master

// ─── Axios Instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor (logging / auth tokens if needed later) ─────────────
api.interceptors.request.use(
  (config) => {
    // You can attach auth tokens here in the future:
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor (global error handling) ────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error]', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════════════════════════
//  CAMPAIGN APIs
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Fetch all campaigns.
 * GET /api/campaigns
 */
export const getAllCampaigns = () => api.get('/api/campaigns');

/**
 * Fetch a single campaign with its contacts and message logs.
 * GET /api/campaigns/:id
 */
export const getCampaignById = (id) => api.get(`/api/campaigns/${id}`);

/**
 * Create a new campaign draft.
 * POST /api/campaigns
 * @param {{ name: string, messageTemplate: string }} data
 */
export const createCampaign = (data) => api.post('/api/campaigns', data);

/**
<<<<<<< HEAD
=======
 * Update an existing campaign.
 * PUT /api/campaigns/:id
 */
export const updateCampaign = (id, data) => api.put(`/api/campaigns/${id}`, data);

/**
>>>>>>> master
 * Upload contacts (Excel / CSV) to a campaign.
 * POST /api/campaigns/:id/upload-contacts
 * @param {string} id - Campaign ID
 * @param {FormData} formData - FormData containing the file
 */
export const uploadContacts = (id, formData) =>
  api.post(`/api/campaigns/${id}/upload-contacts`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * Start sending a campaign.
 * POST /api/campaigns/:id/send
 * @param {string} id - Campaign ID
 * @param {boolean} [force=false] - Force restart even if already sent
 */
export const sendCampaign = (id, force = false) =>
  api.post(`/api/campaigns/${id}/send${force ? '?force=true' : ''}`);

/**
 * Duplicate a completed campaign into a fresh draft.
 * POST /api/campaigns/:id/duplicate
 */
export const duplicateCampaign = (id) => api.post(`/api/campaigns/${id}/duplicate`);

// ═══════════════════════════════════════════════════════════════════════════════
//  WHATSAPP APIs
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get the current WhatsApp connection status.
 * GET /api/whatsapp/status
 */
export const getWhatsAppStatus = () => api.get('/api/whatsapp/status');

/**
 * Logout / disconnect the WhatsApp session.
 * POST /api/whatsapp/logout
 */
export const logoutWhatsApp = () => api.post('/api/whatsapp/logout');

/**
 * Send a single WhatsApp message (quick send).
 * POST /send
 * @param {{ number: string, message: string }} data
 */
export const sendSingleMessage = (data) => api.post('/send', data);

// ─── Export the raw axios instance for custom calls if needed ─────────────────
export default api;
