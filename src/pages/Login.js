import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const COMPTES_DEFAUT = [
  { id: 1, nom: 'Super Admin', email: 'superadmin@nexstock.com', password: 'super123', role: 'superadmin', statut: 'actif' },
  { id: 2, nom: 'Admin Principal', email: 'adminpro1@nexstock.com', password: 'Admin@2026', role: 'admin', statut: 'actif' },
  { id: 3, nom: 'Admin Secondaire', email: 'adminpro2@nexstock.com', password: 'Admin@2026', role: 'admin', statut: 'actif' },
];

function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nom, setNom] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('utilisateurs')) localStorage.setItem('utilisateurs', JSON.stringify(COMPTES_DEFAUT));
    if (!localStorage.getItem('produits')) localStorage.setItem('produits', JSON.stringify([]));
    if (!localStorage.getItem('mouvements')) localStorage.setItem('mouvements', JSON.stringify([]));
  }, []);

  const inp = {
    width: '100%', padding: '10px 13px', border: '1.5px solid #e2e8f0',
    borderRadius: '8px', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', marginBottom: '14px', color: '#1a202c',
    fontFamily: "'Segoe UI', Arial, sans-serif"
  };

  const handleLogin = () => {
    setError('');
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    const users = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) { setError('Email ou mot de passe incorrect.'); return; }
    if (user.statut === 'inactif') { setError('Compte désactivé. Contactez un administrateur.'); return; }
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/dashboard');
  };

  const handleInscription = () => {
    setError(''); setSuccess('');
    if (!nom || !email || !password || !confirmPassword) { setError('Veuillez remplir tous les champs.'); return; }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); return; }
    if (password !== confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return; }
    const users = JSON.parse(localStorage.getItem('utilisateurs') || '[]');
    if (users.find(u => u.email === email)) { setError('Cet email est déjà utilisé.'); return; }
    users.push({ id: Date.now(), nom, email, password, role: 'employe', statut: 'actif', dateCreation: new Date().toLocaleDateString('fr-FR') });
    localStorage.setItem('utilisateurs', JSON.stringify(users));
    setSuccess('Compte créé avec succès. Vous pouvez vous connecter.');
    setMode('login'); setNom(''); setEmail(''); setPassword(''); setConfirmPassword('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7, #bbf7d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '40px', width: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #16a34a, #15803d)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="white" strokeWidth="2"/>
              <line x1="12" y1="12" x2="12" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="10" y1="14" x2="14" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1a202c', fontWeight: '700', letterSpacing: '-0.5px' }}>Nex<span style={{ color: '#16a34a' }}>Stock</span></h1>
          <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: '13px' }}>Plateforme de gestion de stock</p>
        </div>
        <div style={{ display: 'flex', marginBottom: '24px', background: '#f8fafc', borderRadius: '10px', padding: '4px', border: '1px solid #e2e8f0' }}>
          {['login','inscription'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess(''); }} style={{ flex: 1, padding: '9px', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', background: mode === m ? 'white' : 'transparent', color: mode === m ? '#16a34a' : '#64748b', boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {m === 'login' ? 'Connexion' : 'Créer un compte'}
            </button>
          ))}
        </div>
        {success && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 14px', color: '#15803d', fontSize: '13px', marginBottom: '14px' }}>{success}</div>}
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '10px 14px', color: '#dc2626', fontSize: '13px', marginBottom: '14px' }}>{error}</div>}
        {mode === 'login' && (<>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '600', fontSize: '13px' }}>Adresse email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '600', fontSize: '13px' }}>Mot de passe</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inp} onKeyDown={e => e.key==='Enter' && handleLogin()} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          <button onClick={handleLogin} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Se connecter</button>
        </>)}
        {mode === 'inscription' && (<>
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '600', fontSize: '13px' }}>Nom complet</label>
          <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Jean Dupont" style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '600', fontSize: '13px' }}>Adresse email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '600', fontSize: '13px' }}>Mot de passe <span style={{ color: '#94a3b8', fontWeight: '400' }}>(min. 6 caractères)</span></label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inp, borderColor: password.length > 0 && password.length < 6 ? '#dc2626' : '#e2e8f0' }} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          {password.length > 0 && password.length < 6 && <p style={{ color: '#dc2626', fontSize: '12px', margin: '-10px 0 10px' }}>{password.length}/6 caractères minimum</p>}
          <label style={{ display: 'block', marginBottom: '5px', color: '#374151', fontWeight: '600', fontSize: '13px' }}>Confirmer le mot de passe</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={{ ...inp, borderColor: confirmPassword.length > 0 && confirmPassword !== password ? '#dc2626' : '#e2e8f0' }} onKeyDown={e => e.key==='Enter' && handleInscription()} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
          <div style={{ background: '#f0fdf4', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', border: '1px solid #bbf7d0' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#15803d' }}>Les comptes créés ici ont le rôle <strong>Employé</strong>. Pour un accès admin, contactez votre responsable.</p>
          </div>
          <button onClick={handleInscription} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Créer mon compte</button>
        </>)}
      </div>
    </div>
  );
}
export default Login;
