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


function Mouvements() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [mouvements, setMouvements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filtre, setFiltre] = useState('tous');
  const [form, setForm] = useState({ produit: '', type: 'entree', quantite: '', note: '' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setMouvements(JSON.parse(localStorage.getItem('mouvements') || '[]'));
  }, []);

  if (!user) return null;

  const produits = JSON.parse(localStorage.getItem('produits') || '[]');

  const handleSubmit = () => {
    if (!form.produit || !form.quantite) return;
    const ps = JSON.parse(localStorage.getItem('produits') || '[]');
    const idx = ps.findIndex(p => p.nom === form.produit);
    if (idx !== -1) {
      if (form.type === 'entree') ps[idx].quantite += parseInt(form.quantite);
      else {
        if (ps[idx].quantite < parseInt(form.quantite)) { alert('Stock insuffisant.'); return; }
        ps[idx].quantite -= parseInt(form.quantite);
      }
      localStorage.setItem('produits', JSON.stringify(ps));
    }
    const nouveau = { id: Date.now(), date: new Date().toLocaleDateString('fr-FR'), produit: form.produit, type: form.type, quantite: parseInt(form.quantite), note: form.note, utilisateur: user.nom };
    const updated = [nouveau, ...mouvements];
    localStorage.setItem('mouvements', JSON.stringify(updated));
    setMouvements(updated);
    setShowForm(false); setForm({ produit: '', type: 'entree', quantite: '', note: '' });
  };

  const filtres = mouvements.filter(m => filtre === 'tous' || m.type === filtre);
  const totalE = mouvements.filter(m=>m.type==='entree').reduce((a,m)=>a+m.quantite,0);
  const totalS = mouvements.filter(m=>m.type==='sortie').reduce((a,m)=>a+m.quantite,0);

  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#1a202c', fontFamily: "'Segoe UI', Arial, sans-serif" };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <Header navigate={navigate} user={user} />
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>Mouvements de stock</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Historique des entrées et sorties</p>
          </div>
          <button onClick={() => setShowForm(true)} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            + Nouveau mouvement
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total entrées', value: totalE, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'Total sorties', value: totalS, color: '#dc2626', bg: '#fef2f2' },
            { label: 'Total mouvements', value: mouvements.length, color: '#0284c7', bg: '#f0f9ff' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '26px', fontWeight: '700', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Nouveau mouvement</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Produit *</label>
                <select value={form.produit} onChange={e => setForm({...form, produit: e.target.value})} style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
                  <option value="">-- Sélectionner un produit --</option>
                  {produits.map(p => <option key={p.id} value={p.nom}>{p.nom} (stock: {p.quantite})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Type *</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
                  <option value="entree">Entrée</option>
                  <option value="sortie">Sortie</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Quantité *</label>
                <input type="number" placeholder="Ex: 50" value={form.quantite} onChange={e => setForm({...form, quantite: e.target.value})} style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Note</label>
                <input type="text" placeholder="Ex: Livraison fournisseur" value={form.note} onChange={e => setForm({...form, note: e.target.value})} style={inp} onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSubmit} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Enregistrer</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[['tous','Tous'], ['entree','Entrées'], ['sortie','Sorties']].map(([key, label]) => (
            <button key={key} onClick={() => setFiltre(key)} style={{ padding: '7px 16px', border: '1px solid', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', background: filtre===key ? '#16a34a' : 'white', color: filtre===key ? 'white' : '#64748b', borderColor: filtre===key ? '#16a34a' : '#e2e8f0' }}>{label}</button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Date', 'Produit', 'Type', 'Quantité', 'Note', 'Effectué par'].map((h,i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtres.length === 0 ? (
                <tr><td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Aucun mouvement enregistré</td></tr>
              ) : filtres.map((m, i) => (
                <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                  onMouseOver={e => e.currentTarget.style.background='#f8fafc'}
                  onMouseOut={e => e.currentTarget.style.background='white'}>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{m.date}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>{m.produit}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: m.type==='entree' ? '#f0fdf4' : '#fef2f2', color: m.type==='entree' ? '#16a34a' : '#dc2626', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                      {m.type === 'entree' ? 'Entrée' : 'Sortie'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: m.type==='entree' ? '#16a34a' : '#dc2626', fontSize: '15px' }}>
                    {m.type==='entree' ? '+' : '-'}{m.quantite}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{m.note || '—'}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#f0fdf4', color: '#15803d', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{m.utilisateur}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Mouvements;
