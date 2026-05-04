import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { WeatherProvider } from './context/WeatherContext';

function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <div className="dynamic-bg" id="dynamic-bg">
            <div className="blob1"></div>
            <div className="blob2"></div>
            <div className="blob3"></div>
        </div>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid var(--border-glass)'
          }
        }}/>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </WeatherProvider>
    </AuthProvider>
  );
}

export default App;
