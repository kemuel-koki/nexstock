import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Header = ({ navigate, user }) => {
  const getRoleBadge = (role) => {
    if (role === 'superadmin') return { label: 'Super Admin', color: '#7c3aed' };
    if (role === 'admin') return { label: 'Administrateur', color: '#16a34a' };
    return { label: 'Employé', color: '#0284c7' };
  };
  const badge = user ? getRoleBadge(user.role) : null;

  return (
    <div style={{
      background: 'white', height: '64px', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px', height: '34px',
          background: 'linear-gradient(135deg, #16a34a, #15803d)',
          borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="white" strokeWidth="2" fill="none"/>
            <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="white" strokeWidth="2"/>
            <line x1="12" y1="12" x2="12" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="14" x2="14" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', letterSpacing: '-0.5px' }}>
          Nex<span style={{ color: '#16a34a' }}>Stock</span>
        </span>
      </div>
      <nav style={{ display: 'flex', gap: '4px' }}>
        {[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Produits', path: '/produits' },
          { label: 'Mouvements', path: '/mouvements' },
          { label: 'Alertes', path: '/alertes' },
          ...(user && user.role !== 'employe' ? [{ label: 'Utilisateurs', path: '/utilisateurs' }] : [])
        ].map((item) => (
          <button key={item.path} onClick={() => navigate(item.path)} style={{
            padding: '7px 14px', border: 'none', borderRadius: '7px',
            cursor: 'pointer', fontSize: '13px', fontWeight: '500',
            background: window.location.pathname === item.path ? '#f0fdf4' : 'transparent',
            color: window.location.pathname === item.path ? '#16a34a' : '#64748b',
            transition: 'all 0.15s'
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#16a34a'; }}
          onMouseOut={e => { e.currentTarget.style.background = window.location.pathname === item.path ? '#f0fdf4' : 'transparent'; e.currentTarget.style.color = window.location.pathname === item.path ? '#16a34a' : '#64748b'; }}
          >{item.label}</button>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {badge && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: badge.color, display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px'
            }}>
              {user.nom.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>{user.nom}</div>
              <div style={{ fontSize: '11px', color: badge.color, fontWeight: '500' }}>{badge.label}</div>
            </div>
          </div>
        )}
        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} style={{
          padding: '7px 14px', border: '1px solid #e2e8f0', borderRadius: '7px',
          cursor: 'pointer', fontSize: '13px', fontWeight: '500',
          background: 'white', color: '#64748b', transition: 'all 0.15s'
        }}
        onMouseOver={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.color = '#dc2626'; }}
        onMouseOut={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
        >Déconnexion</button>
      </div>
    </div>
  );
};


function Utilisateurs() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', password: '', role: 'employe' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'employe') { navigate('/dashboard'); return; }
    setUtilisateurs(JSON.parse(localStorage.getItem('utilisateurs') || '[]'));
  }, []);

  if (!user || user.role === 'employe') return null;

  const sauvegarder = (data) => { localStorage.setItem('utilisateurs', JSON.stringify(data)); setUtilisateurs(data); };

  const handleSubmit = () => {
    if (!form.nom || !form.email || !form.password) return;
    if (form.password.length < 6) { alert('Mot de passe trop court.'); return; }
    const exists = utilisateurs.find(u => u.email === form.email);
    if (exists) { alert('Email déjà utilisé.'); return; }
    sauvegarder([...utilisateurs, { id: Date.now(), ...form, statut: 'actif', dateCreation: new Date().toLocaleDateString('fr-FR') }]);
    setShowForm(false); setForm({ nom: '', email: '', password: '', role: 'employe' });
  };

  const toggleStatut = (id) => {
    if (id === 1) return;
    sauvegarder(utilisateurs.map(u => u.id === id ? { ...u, statut: u.statut === 'actif' ? 'inactif' : 'actif' } : u));
  };

  const handleDelete = (id) => {
    if (id === 1) { alert('Impossible de supprimer le Super Admin.'); return; }
    if (window.confirm('Supprimer cet utilisateur ?')) sauvegarder(utilisateurs.filter(u => u.id !== id));
  };

  const getRoleBadge = (role) => {
    if (role === 'superadmin') return { label: 'Super Admin', color: '#7c3aed', bg: '#f5f3ff' };
    if (role === 'admin') return { label: 'Admin', color: '#16a34a', bg: '#f0fdf4' };
    return { label: 'Employé', color: '#0284c7', bg: '#f0f9ff' };
  };

  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#1a202c', fontFamily: "'Segoe UI', Arial, sans-serif" };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <Header navigate={navigate} user={user} />
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>Utilisateurs</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{utilisateurs.length} compte(s) enregistré(s)</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            + Ajouter un utilisateur
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Super Admins', value: utilisateurs.filter(u=>u.role==='superadmin').length, color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Administrateurs', value: utilisateurs.filter(u=>u.role==='admin').length, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Employés', value: utilisateurs.filter(u=>u.role==='employe').length, color: '#0284c7', bg: '#f0f9ff' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '26px', fontWeight: '700', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Nouvel utilisateur</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              {[['Nom complet *', 'nom', 'text', 'Jean Dupont'], ['Email *', 'email', 'email', 'jean@example.com'], ['Mot de passe *', 'password', 'password', '••••••••']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Rôle</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
                  {user.role === 'superadmin' && <option value="superadmin">Super Admin</option>}
                  <option value="admin">Administrateur</option>
                  <option value="employe">Employé</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSubmit} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Ajouter</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Utilisateur', 'Email', 'Rôle', 'Statut', 'Date création', 'Actions'].map((h,i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((u, i) => {
                const badge = getRoleBadge(u.role);
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseOver={e => e.currentTarget.style.background='#f8fafc'}
                    onMouseOut={e => e.currentTarget.style.background='white'}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: badge.color, fontWeight: '700', fontSize: '14px' }}>
                          {u.nom.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>{u.nom}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: badge.bg, color: badge.color, padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{badge.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: u.statut==='actif' ? '#f0fdf4' : '#f8fafc', color: u.statut==='actif' ? '#16a34a' : '#94a3b8', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                        {u.statut === 'actif' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px' }}>{u.dateCreation || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {u.id !== 1 && (
                          <button onClick={() => toggleStatut(u.id)} style={{ padding: '5px 12px', background: u.statut==='actif' ? '#fffbeb' : '#f0fdf4', color: u.statut==='actif' ? '#d97706' : '#16a34a', border: `1px solid ${u.statut==='actif' ? '#fde68a' : '#bbf7d0'}`, borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
                            {u.statut === 'actif' ? 'Désactiver' : 'Activer'}
                          </button>
                        )}
                        {u.id !== 1 && (
                          <button onClick={() => handleDelete(u.id)} style={{ padding: '5px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Supprimer</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Utilisateurs;
