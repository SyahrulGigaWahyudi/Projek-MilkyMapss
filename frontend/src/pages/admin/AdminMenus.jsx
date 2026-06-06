import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminDashboard';
import { getMenus } from '../../services/api';
import API from '../../services/api';

export default function AdminMenus() {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getMenus()
      .then(res => setMenus(res.data?.data || res.data || []))
      .catch(() => setMenus([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = menus.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await API.delete(`/menus/${deleteModal.id}`);
      setMenus(prev => prev.filter(m => m.id !== deleteModal.id));
      setDeleteModal(null);
    } catch {} finally { setDeleting(false); }
  };

  return (
    <AdminLayout title="Data Menu">
      <div className="mm-admin-toolbar">
        <div className="mm-search-box" style={{ maxWidth: 360 }}>
          <span className="material-symbols-outlined">search</span>
          <input placeholder="Cari menu..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="mm-btn-primary" onClick={() => navigate('/admin/menus/add')}>
          <span className="material-symbols-outlined">add</span>
          Tambah Menu
        </button>
      </div>

      <div className="mm-admin-table-wrap">
        <table className="mm-admin-table">
          <thead>
            <tr><th>No</th><th>Nama Menu</th><th>Kategori</th><th>Harga</th><th>Status</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="mm-table-loading">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="mm-table-loading">Tidak ada data.</td></tr>
            ) : filtered.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td><strong>{m.name}</strong></td>
                <td><span className="mm-menu-tag">{m.category || '–'}</span></td>
                <td className="mm-menu-price">Rp{Number(m.price || 0).toLocaleString('id-ID')}</td>
                <td>
                  <span className={`mm-status-pill ${m.is_available ? 'available' : 'unavailable'}`}>
                    {m.is_available ? 'Tersedia' : 'Habis'}
                  </span>
                </td>
                <td>
                  <div className="mm-table-actions">
                    <button className="mm-icon-btn" title="Edit" onClick={() => navigate(`/admin/menus/${m.id}/edit`)}>
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="mm-icon-btn" style={{ color: 'var(--error)' }} onClick={() => setDeleteModal(m)}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteModal && (
        <div className="mm-modal-overlay" onClick={() => setDeleteModal(null)}>
          <div className="mm-modal" onClick={e => e.stopPropagation()}>
            <div className="mm-modal-icon danger"><span className="material-symbols-outlined">delete_forever</span></div>
            <h3>Hapus Menu "{deleteModal.name}"?</h3>
            <p>Menu ini akan dihapus secara permanen.</p>
            <div className="mm-modal-actions">
              <button className="mm-btn-outline" onClick={() => setDeleteModal(null)}>Batal</button>
              <button className="mm-btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? <span className="mm-btn-spinner"></span> : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
