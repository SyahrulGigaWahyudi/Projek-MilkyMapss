import { useState, useEffect } from 'react';

const ratingLabels = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Sangat Bagus'];

export default function ReviewModal({ isOpen, onClose, onSubmit, initialRating = 0, initialComment = '', title = 'Tulis Ulasan', loading = false }) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [error, setError] = useState('');

  // Sync with props when modal opens or initialValues change
  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
      setComment(initialComment);
      setError('');
      setHoverRating(0);
    }
  }, [isOpen, initialRating, initialComment]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Pilih rating terlebih dahulu.'); return; }
    setError('');
    onSubmit({ rating, comment });
  };

  return (
    <div className="mm-modal-overlay" onClick={onClose}>
      <div className="mm-review-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="mm-review-modal-header">
          <h3>{title}</h3>
          <button className="mm-modal-close" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mm-alert mm-alert-error mb-3">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>error</span>
              {error}
            </div>
          )}

          {/* Star Rating */}
          <div className="mm-review-modal-field">
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

          {/* Comment */}
          <div className="mm-review-modal-field">
            <label htmlFor="review-comment">Komentar (Opsional)</label>
            <textarea id="review-comment" rows={4}
              placeholder="Ceritakan pengalamanmu di sini..."
              value={comment} onChange={e => setComment(e.target.value)}
              className="mm-textarea" />
          </div>

          {/* Actions */}
          <div className="mm-review-modal-actions">
            <button type="button" className="mm-btn-outline" onClick={onClose}>Batal</button>
            <button type="submit" className="mm-btn-primary" disabled={loading}>
              {loading ? <span className="mm-btn-spinner"></span> : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
