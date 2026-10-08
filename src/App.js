import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produits from './pages/Produits';
import Utilisateurs from './pages/Utilisateurs';
import Mouvements from './pages/Mouvements';
import Alertes from './pages/Alertes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produits" element={<Produits />} />
        <Route path="/utilisateurs" element={<Utilisateurs />} />
        <Route path="/mouvements" element={<Mouvements />} />
        <Route path="/alertes" element={<Alertes />} />
      </Routes>
    </Router>
  );
}

export default App;