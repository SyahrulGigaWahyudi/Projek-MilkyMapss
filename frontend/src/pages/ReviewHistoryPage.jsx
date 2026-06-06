import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReviews, deleteReview, updateReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import ReviewModal from '../components/ReviewModal';

export default function ReviewHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    getReviews({ user_id: user.id })
      .then(res => setReviews(res.data?.data || res.data || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await deleteReview(deleteModal.id);
      setReviews(prev => prev.filter(r => r.id !== deleteModal.id));
      setDeleteModal(null);
    } catch {} finally { setDeleting(false); }
  };

  const handleEdit = async ({ rating, comment }) => {
    if (!editModal) return;
    setEditLoading(true);
    try {
      await updateReview(editModal.id, { rating, comment });
      setReviews(prev => prev.map(r =>
        r.id === editModal.id ? { ...r, rating, comment } : r
      ));
      setEditModal(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengupdate ulasan.');
    } finally { setEditLoading(false); }
  };

  const renderStars = (rating) => (
    <div className="mm-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`material-symbols-outlined star-sm ${i <= rating ? 'filled' : 'empty'}`}>
          {i <= rating ? 'star' : 'star_border'}
        </span>
      ))}
    </div>
  );

  return (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">
        <header className="mm-topbar">
          <button className="mm-back-btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali
          </button>
        </header>
        <div className="mm-page-content" style={{ maxWidth: 720 }}>
          <h2 className="mm-page-title">Riwayat Ulasan</h2>
          <p className="mm-page-subtitle mb-4">Semua ulasan yang pernah kamu tulis.</p>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[1,2,3].map(i => <div key={i} className="mm-skeleton-card" style={{ height: 120 }}></div>)}
            </div>
          ) : reviews.length === 0 ? (
            <div className="mm-empty-state">
              <span className="material-symbols-outlined">rate_review</span>
              <h3>Belum Ada Ulasan</h3>
              <p>Kamu belum menulis ulasan. Cari tempat makan dan bagikan pengalamanmu!</p>
              <button className="mm-btn-primary mt-3" onClick={() => navigate('/explore')}>Cari Tempat Makan</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(rev => (
                <div key={rev.id} className="mm-review-history-card">
                  <div className="mm-review-history-top">
                    <div>
                      <h4 className="mm-review-history-place" onClick={() => navigate(`/food/${rev.food_place_id}`)}>
                        {rev.food_place_name || `Tempat Makan #${rev.food_place_id}`}
                      </h4>
                      <p className="mm-review-date">
                        {new Date(rev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    {renderStars(rev.rating)}
                  </div>
                  {rev.comment && <p className="mm-review-comment">"{rev.comment}"</p>}
                  <div className="mm-review-history-actions">
                    <button className="mm-btn-ghost" onClick={() => navigate(`/food/${rev.food_place_id}`)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                      Lihat Tempat
                    </button>
                    <button className="mm-btn-ghost" onClick={() => setEditModal(rev)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                      Edit
                    </button>
                    <button className="mm-btn-ghost" style={{ color: 'var(--error)' }}
                      onClick={() => setDeleteModal(rev)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {deleteModal && (
          <div className="mm-modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="mm-modal" onClick={e => e.stopPropagation()}>
              <div className="mm-modal-icon danger">
                <span className="material-symbols-outlined">delete_forever</span>
              </div>
              <h3>Hapus Ulasan?</h3>
              <p>Ulasan ini akan dihapus secara permanen dan tidak dapat dikembalikan.</p>
              <div className="mm-modal-actions">
                <button className="mm-btn-outline" onClick={() => setDeleteModal(null)}>Batal</button>
                <button className="mm-btn-danger" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <span className="mm-btn-spinner"></span> : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Review Modal */}
        <ReviewModal
          isOpen={!!editModal}
          onClose={() => setEditModal(null)}
          onSubmit={handleEdit}
          initialRating={editModal?.rating || 0}
          initialComment={editModal?.comment || ''}
          title="Edit Ulasan"
          loading={editLoading}
        />
      </main>
    </div>
  );
}
