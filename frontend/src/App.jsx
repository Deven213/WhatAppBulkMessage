import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CampaignsList from './pages/CampaignsList';
import CreateCampaign from './pages/CreateCampaign';
import CampaignDetails from './pages/CampaignDetails';
import ImportContacts from './pages/ImportContacts';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campaigns" element={<CampaignsList />} />
            <Route path="/create" element={<CreateCampaign />} />
            <Route path="/import" element={<ImportContacts />} />
            <Route path="/campaign/:id" element={<CampaignDetails />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
