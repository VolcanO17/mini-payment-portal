import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/transactions" element={token ? <TransactionHistory /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
