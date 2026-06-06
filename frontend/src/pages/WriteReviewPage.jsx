import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createReview } from '../services/api';
import SideNav from '../components/SideNav';

export default function WriteReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Pilih rating terlebih dahulu.'); return; }
    setLoading(true);
    try {
      await createReview({ food_place_id: id, rating, comment });
      navigate(`/food/${id}`, { state: { reviewSubmitted: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim ulasan.');
    } finally { setLoading(false); }
  };

  const ratingLabels = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Sangat Bagus'];

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
        <div className="mm-page-content" style={{ maxWidth: 560 }}>
          <h2 className="mm-page-title">Tulis Ulasan</h2>
          <p className="mm-page-subtitle mb-4">Bagikan pengalamanmu di tempat makan ini.</p>

          <div className="mm-panel">
            <form onSubmit={handleSubmit}>
              {error && <div className="mm-alert mm-alert-error mb-3">{error}</div>}

              <div className="mm-field">
                <label>Rating</label>
                <div className="mm-star-input">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} type="button"
                      className={`mm-star-btn ${s <= (hoverRating || rating) ? 'filled' : ''}`}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}>
                      <span className="material-symbols-outlined">star</span>
                    </button>
                  ))}
                </div>
                {(hoverRating || rating) > 0 && (
                  <p className="mm-rating-label">{ratingLabels[hoverRating || rating]}</p>
                )}
              </div>

              <div className="mm-field">
                <label htmlFor="comment">Komentar (Opsional)</label>
                <textarea id="comment" rows={4}
                  placeholder="Ceritakan pengalamanmu di sini..."
                  value={comment} onChange={e => setComment(e.target.value)}
                  className="mm-textarea" />
              </div>

              <button type="submit" className="mm-btn-primary w-100" disabled={loading}>
                {loading ? <span className="mm-btn-spinner"></span> : 'Kirim Ulasan'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
