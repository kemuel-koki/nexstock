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


function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ totalProduits: 0, stockFaible: 0, entresMois: 0, sortiesMois: 0 });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const produits = JSON.parse(localStorage.getItem('produits') || '[]');
    const mouvements = JSON.parse(localStorage.getItem('mouvements') || '[]');
    const now = new Date();
    const moisActuel = now.getMonth();
    const anneeActuelle = now.getFullYear();
    const mvtMois = mouvements.filter(m => {
      const parts = m.date.split('/');
      if (parts.length === 3) return parseInt(parts[1])-1 === moisActuel && parseInt(parts[2]) === anneeActuelle;
      return false;
    });
    setStats({
      totalProduits: produits.length,
      stockFaible: produits.filter(p => p.quantite <= p.seuil).length,
      entresMois: mvtMois.filter(m => m.type==='entree').reduce((a,m) => a+m.quantite, 0),
      sortiesMois: mvtMois.filter(m => m.type==='sortie').reduce((a,m) => a+m.quantite, 0),
    });
  }, []);

  if (!user) return null;

  const cards = [
    { label: 'Produits en stock', value: stats.totalProduits, sub: 'Total références', color: '#16a34a', bg: '#f0fdf4',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 7H4C2.9 7 2 7.9 2 9V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V9C22 7.9 21.1 7 20 7Z" stroke="#16a34a" strokeWidth="2" fill="none"/><path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="#16a34a" strokeWidth="2"/></svg> },
    { label: 'Alertes stock', value: stats.stockFaible, sub: 'Sous le seuil minimum', color: '#dc2626', bg: '#fef2f2',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Entrées ce mois', value: stats.entresMois, sub: 'Unités reçues', color: '#0284c7', bg: '#f0f9ff',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="12" y1="19" x2="12" y2="5" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"/><polyline points="5 12 12 5 19 12" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { label: 'Sorties ce mois', value: stats.sortiesMois, sub: 'Unités expédiées', color: '#d97706', bg: '#fffbeb',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/><polyline points="19 12 12 19 5 12" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  ];

  const menus = [
    { label: 'Produits', desc: 'Gérer le catalogue et les stocks', path: '/produits', color: '#16a34a' },
    { label: 'Mouvements', desc: 'Enregistrer entrées et sorties', path: '/mouvements', color: '#0284c7' },
    { label: 'Alertes', desc: 'Surveiller les stocks critiques', path: '/alertes', color: '#dc2626' },
    ...(user.role !== 'employe' ? [{ label: 'Utilisateurs', desc: 'Gérer les accès et comptes', path: '/utilisateurs', color: '#7c3aed' }] : []),
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <Header navigate={navigate} user={user} />
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>Tableau de bord</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Bienvenue, {user.nom}. Voici un aperçu de votre activité.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
          {cards.map((card, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: card.bg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.icon}</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: card.color, marginBottom: '2px' }}>{card.value}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a202c' }}>{card.label}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{card.sub}</div>
            </div>
          ))}
        </div>
        <div>
          <h2 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Accès rapide</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {menus.map((menu, i) => (
              <div key={i} onClick={() => navigate(menu.path)} style={{ background: 'white', borderRadius: '12px', padding: '20px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor=menu.color; }}
                onMouseOut={e => { e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor='#e2e8f0'; }}>
                <div style={{ width: '4px', height: '40px', background: menu.color, borderRadius: '4px', marginBottom: '12px' }}></div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a202c', marginBottom: '4px' }}>{menu.label}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>{menu.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
