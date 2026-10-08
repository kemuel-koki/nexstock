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


function Produits() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [produits, setProduits] = useState([]);
  const [recherche, setRecherche] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduit, setEditProduit] = useState(null);
  const [form, setForm] = useState({ nom: '', categorie: '', quantite: '', prix: '', seuil: '' });

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setProduits(JSON.parse(localStorage.getItem('produits') || '[]'));
  }, []);

  if (!user) return null;

  const sauvegarder = (data) => { localStorage.setItem('produits', JSON.stringify(data)); setProduits(data); };

  const handleSubmit = () => {
    if (!form.nom || !form.quantite) return;
    let data;
    if (editProduit) {
      data = produits.map(p => p.id === editProduit.id ? { ...p, ...form, quantite: parseInt(form.quantite), prix: parseFloat(form.prix||0), seuil: parseInt(form.seuil||0) } : p);
    } else {
      data = [...produits, { id: Date.now(), nom: form.nom, categorie: form.categorie, quantite: parseInt(form.quantite), prix: parseFloat(form.prix||0), seuil: parseInt(form.seuil||0), ajoutePar: user.nom, dateAjout: new Date().toLocaleDateString('fr-FR') }];
    }
    sauvegarder(data); setShowForm(false); setEditProduit(null); setForm({ nom:'', categorie:'', quantite:'', prix:'', seuil:'' });
  };

  const handleEdit = (p) => { setEditProduit(p); setForm({ nom: p.nom, categorie: p.categorie, quantite: p.quantite, prix: p.prix, seuil: p.seuil }); setShowForm(true); };
  const handleDelete = (id) => { if (window.confirm('Supprimer ce produit ?')) sauvegarder(produits.filter(p => p.id !== id)); };

  const filtres = produits.filter(p => p.nom.toLowerCase().includes(recherche.toLowerCase()) || p.categorie?.toLowerCase().includes(recherche.toLowerCase()));

  const inp = { width: '100%', padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box', color: '#1a202c', fontFamily: "'Segoe UI', Arial, sans-serif" };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <Header navigate={navigate} user={user} />
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '700', color: '#1a202c' }}>Produits</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{produits.length} référence(s) · {produits.filter(p=>p.quantite<=p.seuil).length} alerte(s)</p>
          </div>
          <button onClick={() => { setShowForm(true); setEditProduit(null); setForm({ nom:'', categorie:'', quantite:'', prix:'', seuil:'' }); }} style={{ padding: '9px 18px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            + Ajouter un produit
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <input type="text" placeholder="Rechercher un produit ou une catégorie..." value={recherche} onChange={e => setRecherche(e.target.value)}
            style={{ ...inp, padding: '10px 14px', fontSize: '14px', width: '340px', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
        </div>

        {showForm && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>{editProduit ? 'Modifier le produit' : 'Nouveau produit'}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              {[['Nom du produit *', 'nom', 'text', 'Ex: Café Arabica'], ['Catégorie', 'categorie', 'text', 'Ex: Boissons'], ['Quantité *', 'quantite', 'number', '0'], ['Prix (€)', 'prix', 'number', '0.00'], ['Seuil alerte', 'seuil', 'number', '0']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '600', color: '#374151' }}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} style={inp}
                    onFocus={e => e.target.style.borderColor='#16a34a'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSubmit} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>{editProduit ? 'Enregistrer' : 'Ajouter'}</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '9px 20px', background: 'white', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Annuler</button>
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                {['Produit', 'Catégorie', 'Quantité', 'Prix', 'Statut', 'Ajouté par', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtres.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>Aucun produit trouvé</td></tr>
              ) : filtres.map((p, i) => {
                const faible = p.quantite <= p.seuil;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}
                    onMouseOver={e => e.currentTarget.style.background='#f8fafc'}
                    onMouseOut={e => e.currentTarget.style.background='white'}>
                    <td style={{ padding: '14px 16px', fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>{p.nom}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: '#f0fdf4', color: '#15803d', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{p.categorie || '—'}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: '700', color: faible ? '#dc2626' : '#1a202c', fontSize: '15px' }}>{p.quantite}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '14px' }}>{p.prix ? `${parseFloat(p.prix).toFixed(2)} €` : '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: faible ? '#fef2f2' : '#f0fdf4', color: faible ? '#dc2626' : '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                        {faible ? 'Stock faible' : 'En stock'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '13px' }}>{p.ajoutePar || '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEdit(p)} style={{ padding: '5px 12px', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Modifier</button>
                        {user.role !== 'employe' && <button onClick={() => handleDelete(p.id)} style={{ padding: '5px 12px', background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Supprimer</button>}
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
export default Produits;
