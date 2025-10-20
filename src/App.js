import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Alerts from './pages/Alerts';
import Devices from './pages/Devices';
import TamperLog from './pages/TamperLog';
import Analytics from './pages/Analytics';
import Audit from './pages/Audit';
import Admin from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/tamper-log" element={<TamperLog />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;
