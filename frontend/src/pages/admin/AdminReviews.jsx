import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminDashboard';
import { getReviews, deleteReview } from '../../services/api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getReviews()
      .then(res => setReviews(res.data?.data || res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter(r =>
    (r.reviewer_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.comment || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.food_place_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await deleteReview(deleteModal.id);
      setReviews(prev => prev.filter(r => r.id !== deleteModal.id));
      setDeleteModal(null);
    } catch {} finally { setDeleting(false); }
  };

  const renderStars = (rating) => (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className="material-symbols-outlined" style={{ fontSize: 14, color: i <= rating ? 'var(--highlight)' : 'var(--surface-high)' }}>
          {i <= rating ? 'star' : 'star_border'}
        </span>
      ))}
    </div>
  );

  return (
    <AdminLayout title="Rating & Ulasan">
      <div className="mm-admin-toolbar">
        <div className="mm-search-box" style={{ maxWidth: 360 }}>
          <span className="material-symbols-outlined">search</span>
          <input placeholder="Cari ulasan..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="mm-result-count"><strong>{filtered.length}</strong> ulasan total</span>
      </div>

      <div className="mm-admin-table-wrap">
        <table className="mm-admin-table">
          <thead>
            <tr><th>No</th><th>Pengguna</th><th>Tempat Makan</th><th>Rating</th><th>Komentar</th><th>Tanggal</th><th>Aksi</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="mm-table-loading">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="mm-table-loading">Tidak ada ulasan.</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="mm-reviewer-avatar" style={{ width: 28, height: 28, fontSize: 12 }}>
                      {(r.reviewer_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span>{r.reviewer_name || 'Anonim'}</span>
                  </div>
                </td>
                <td>{r.food_place_name || `#${r.food_place_id}`}</td>
                <td>{renderStars(r.rating)}</td>
                <td style={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.comment || <em style={{ color: 'var(--text-secondary)' }}>Tanpa komentar</em>}
                </td>
                <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>
                  {new Date(r.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td>
                  <button className="mm-icon-btn" style={{ color: 'var(--error)' }} onClick={() => setDeleteModal(r)}>
                    <span className="material-symbols-outlined">delete</span>
                  </button>
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
            <h3>Hapus Ulasan?</h3>
            <p>Ulasan dari <strong>{deleteModal.reviewer_name || 'Anonim'}</strong> akan dihapus permanen.</p>
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
