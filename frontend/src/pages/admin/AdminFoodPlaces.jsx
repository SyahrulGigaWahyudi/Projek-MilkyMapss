import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminDashboard';
import { getFoodPlaces } from '../../services/api';
import API from '../../services/api';

export default function AdminFoodPlaces() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getFoodPlaces()
      .then(res => setPlaces(res.data?.data || res.data || []))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = places.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await API.delete(`/food-places/${deleteModal.id}`);
      setPlaces(prev => prev.filter(p => p.id !== deleteModal.id));
      setDeleteModal(null);
    } catch {} finally { setDeleting(false); }
  };

  return (
    <AdminLayout title="Data Tempat Makan">
      <div className="mm-admin-toolbar">
        <div className="mm-search-box" style={{ maxWidth: 360 }}>
          <span className="material-symbols-outlined">search</span>
          <input placeholder="Cari tempat makan..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="mm-btn-primary" onClick={() => navigate('/admin/food-places/add')}>
          <span className="material-symbols-outlined">add</span>
          Tambah Baru
        </button>
      </div>

      <div className="mm-admin-table-wrap">
        <table className="mm-admin-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Rating</th>
              <th>Ulasan</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="mm-table-loading">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="mm-table-loading">Tidak ada data.</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td><strong>{p.name}</strong></td>
                <td>{p.detail_location || '–'}</td>
                <td>
                  <div className="mm-rating-badge" style={{ display: 'inline-flex' }}>
                    <span className="material-symbols-outlined star-sm">star</span>
                    {p.average_rating ? Number(p.average_rating).toFixed(1) : '–'}
                  </div>
                </td>
                <td>{p.total_reviews || 0}</td>
                <td>
                  <div className="mm-table-actions">
                    <button className="mm-icon-btn" title="Detail" onClick={() => navigate(`/admin/food-places/${p.id}`)}>
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                    <button className="mm-icon-btn" title="Edit" onClick={() => navigate(`/admin/food-places/${p.id}/edit`)}>
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="mm-icon-btn" title="Hapus" style={{ color: 'var(--error)' }}
                      onClick={() => setDeleteModal(p)}>
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
            <div className="mm-modal-icon danger">
              <span className="material-symbols-outlined">delete_forever</span>
            </div>
            <h3>Hapus "{deleteModal.name}"?</h3>
            <p>Tempat makan ini beserta semua menu dan ulasannya akan dihapus permanen.</p>
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
