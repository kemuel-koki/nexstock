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


function Alertes() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const produits = JSON.parse(localStorage.getItem('produits') || '[]');
    setAlertes(produits.filter(p => p.quantite <= p.seuil));
  }, []);

  if (!user) return null;

  const critiques = alertes.filter(a => a.quantite <= a.seuil / 2);
  const attentions = alertes.filter(a => a.quantite > a.seuil / 2);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <Header navigate={navigate} user={user} />
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>Alertes stock</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Produits sous le seuil minimum</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Critiques', value: critiques.length, color: '#dc2626', bg: '#fef2f2' },
            { label: 'Attention', value: attentions.length, color: '#d97706', bg: '#fffbeb' },
            { label: 'Total alertes', value: alertes.length, color: '#64748b', bg: '#f8fafc' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '26px', fontWeight: '700', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {critiques.length > 0 && (
          <div style={{ background: '#fef2f2', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#dc2626', flexShrink: 0 }}></div>
            <div>
              <div style={{ fontWeight: '600', color: '#dc2626', fontSize: '14px' }}>{critiques.length} produit(s) en état critique — réapprovisionnement immédiat requis</div>
            </div>
          </div>
        )}

        {alertes.length === 0 ? (
          <div style={{ background: 'white', borderRadius: '12px', padding: '60px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '6px' }}>Aucune alerte</div>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>Tous vos produits sont au-dessus du seuil minimum</div>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  {['Produit', 'Catégorie', 'Stock actuel', 'Seuil minimum', 'Manquant', 'Niveau'].map((h,i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alertes.map((a, i) => {
                  const critique = a.quantite <= a.seuil / 2;
                  return (
                    <tr key={a.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                      onMouseOver={e => e.currentTarget.style.background='#f8fafc'}
                      onMouseOut={e => e.currentTarget.style.background='white'}>
                      <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>{a.nom}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: '#f0fdf4', color: '#15803d', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{a.categorie || '—'}</span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#dc2626', fontSize: '15px' }}>{a.quantite}</td>
                      <td style={{ padding: '14px 16px', color: '#64748b' }}>{a.seuil}</td>
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: '#dc2626' }}>-{Math.max(0, a.seuil - a.quantite)}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: critique ? '#fef2f2' : '#fffbeb', color: critique ? '#dc2626' : '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                          {critique ? 'Critique' : 'Attention'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Alertes;
