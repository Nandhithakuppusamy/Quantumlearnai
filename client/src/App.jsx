import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import QuantumLab from './pages/QuantumLab';
import Algorithms from './pages/Algorithms';
import AlgorithmDetail from './pages/AlgorithmDetail';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import VRLab from './pages/VRLab';
import { LabProvider } from './context/LabContext';

export const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#f8fafc',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            backdropFilter: 'blur(12px)',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '14px',
            padding: '12px 18px',
            boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.6), 0 0 20px -5px rgba(6, 182, 212, 0.2)'
          },
          success: {
            iconTheme: {
              primary: '#06b6d4',
              secondary: '#070a12'
            }
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#070a12'
            }
          }
        }}
      />
      <BrowserRouter>
        <LabProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="lab" element={<QuantumLab />} />
              <Route path="vr-lab" element={<VRLab />} />
              <Route path="algorithms" element={<Algorithms />} />
              <Route path="algorithms/:id" element={<AlgorithmDetail />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="progress" element={<Progress />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </LabProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
