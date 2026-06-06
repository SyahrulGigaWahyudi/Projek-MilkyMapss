import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFoodPlaceById, getMenus, getReviews, getFavorites, addFavorite, removeFavorite, createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import ReviewModal from '../components/ReviewModal';
import { AdminLayout } from './admin/AdminDashboard';

function StarDisplay({ rating, size = 'sm' }) {
  const stars = Math.round(rating || 0);
  return (
    <div className="mm-stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`material-symbols-outlined star-${size} ${i <= stars ? 'filled' : 'empty'}`}>
          {i <= stars ? 'star' : 'star_border'}
        </span>
      ))}
    </div>
  );
}

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [place, setPlace] = useState(null);
  const [menus, setMenus] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favId, setFavId] = useState(null);
  const [favLoading, setFavLoading] = useState(false);
  const [menuTab, setMenuTab] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getFoodPlaceById(id),
      getMenus({ food_place_id: id }),
      getReviews({ food_place_id: id, limit: 5 }),
      user ? getFavorites({ food_place_id: id, user_id: user.id }) : Promise.resolve({ data: [] })
    ]).then(([placeRes, menuRes, reviewRes, favRes]) => {
      setPlace(placeRes.data);
      setMenus(menuRes.data?.data || menuRes.data || []);
      setReviews(reviewRes.data?.data || reviewRes.data || []);
      const favs = favRes.data?.data || favRes.data || [];
      if (favs.length > 0) {
        setIsFav(true);
        setFavId(favs[0].favorite_id);
      }
    }).finally(() => setLoading(false));
  }, [id, user]);

  const toggleFav = async () => {
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(favId);
        setIsFav(false);
        setFavId(null);
      } else {
        const res = await addFavorite({ food_place_id: id });
        setIsFav(true);
        setFavId(res.data?.id || res.data?.insertId || null);
      }
    } catch {}
    setFavLoading(false);
  };

  const handleCreateReview = async ({ rating, comment }) => {
    setReviewLoading(true);
    try {
      await createReview({ food_place_id: id, rating, comment });
      // Reload reviews
      const reviewRes = await getReviews({ food_place_id: id, limit: 5 });
      setReviews(reviewRes.data?.data || reviewRes.data || []);
      setShowReviewModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengirim ulasan.');
    } finally { setReviewLoading(false); }
  };

  const menuCategories = ['all', ...new Set(menus.map(m => m.category).filter(Boolean))];
  const filteredMenus = menuTab === 'all' ? menus : menus.filter(m => m.category === menuTab);

  const loadingContent = <div className="mm-loading-screen"><div className="mm-spinner"></div></div>;
  if (loading) return window.location.pathname.startsWith('/admin') ? (
    <AdminLayout title="Detail Tempat Makan"><div className="mm-page-content">{loadingContent}</div></AdminLayout>
  ) : (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">{loadingContent}</main>
    </div>
  );

  const emptyContent = (
    <div className="mm-empty-state mt-5">
      <span className="material-symbols-outlined">error</span>
      <p>Tempat makan tidak ditemukan.</p>
      <button className="mm-btn-primary mt-3" onClick={() => navigate(window.location.pathname.startsWith('/admin') ? '/admin/food-places' : '/explore')}>Kembali</button>
    </div>
  );
  if (!place) return window.location.pathname.startsWith('/admin') ? (
    <AdminLayout title="Detail Tempat Makan"><div className="mm-page-content">{emptyContent}</div></AdminLayout>
  ) : (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">{emptyContent}</main>
    </div>
  );

  const isAdminView = window.location.pathname.startsWith('/admin');

  const content = (
    <>
      {!isAdminView && (
        <header className="mm-topbar">
          <button className="mm-back-btn" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali
          </button>
        </header>
      )}

      <div className="mm-page-content">
        {isAdminView && (
          <button className="mm-back-link mb-4" onClick={() => navigate('/admin/food-places')}>
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Daftar
          </button>
        )}
        <div className="row g-4">
            {/* Left Column */}
            <div className="col-12 col-lg-8">
              {/* Hero Image */}
              <div className="mm-detail-hero">
                {place.thumbnail
                  ? <img src={place.thumbnail} alt={place.name} />
                  : <div className="mm-detail-hero-placeholder" style={{ background: 'linear-gradient(135deg, #FFB599, #FF5F00)' }}>
                      <span className="material-symbols-outlined">restaurant</span>
                    </div>}
                <div className="mm-detail-hero-badges">
                  <span className={`mm-status-badge ${place.is_open ? 'open' : 'closed'}`}>
                    <span className="mm-status-dot"></span>
                    {place.is_open ? 'Buka' : 'Tutup'}
                    {place.opening_time && place.closing_time && (
                      <span style={{ fontWeight: 'normal', opacity: 0.9, marginLeft: 4 }}>
                        ({place.opening_time.slice(0,5)} - {place.closing_time.slice(0,5)})
                      </span>
                    )}
                  </span>
                  {place.campus_name && (
                    <span className="mm-campus-badge-sm">Dari {place.campus_name}</span>
                  )}
                </div>
              </div>

              {/* Info Card */}
              <div className="mm-detail-info-card">
                <div className="mm-detail-info-header">
                  <div>
                    <h2 className="mm-detail-name">{place.name}</h2>
                    <p className="mm-detail-address">
                      <span className="material-symbols-outlined">location_on</span>
                      {place.detail_location || 'Dekat kampus'}
                    </p>
                  </div>
                  <div className="mm-detail-rating-block">
                    <div className="mm-detail-rating-num">
                      <span className="material-symbols-outlined star-lg">star</span>
                      <span>{place.average_rating ? Number(place.average_rating).toFixed(1) : '–'}</span>
                    </div>
                    {place.distance_meters != null && (
                      <span className="mm-distance-tag">
                        {place.distance_meters < 1000
                          ? `${Math.round(place.distance_meters)}m`
                          : `${(place.distance_meters/1000).toFixed(1)}km`}
                      </span>
                    )}
                  </div>
                </div>

                {place.description && <p className="mm-detail-desc">{place.description}</p>}

                <div className="mm-detail-actions">
                  {(place.gmaps_link || (place.latitude && place.longitude)) && (
                    <button className="mm-btn-primary" onClick={() => {
                      const url = place.gmaps_link
                        ? place.gmaps_link
                        : `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
                      window.open(url, '_blank');
                    }}>
                      <span className="material-symbols-outlined">navigation</span>
                      Buka Navigasi
                    </button>
                  )}
                  <button
                    className={`mm-btn-outline ${isFav ? 'fav-active' : ''}`}
                    onClick={!isAdminView ? toggleFav : undefined}
                    disabled={favLoading || isAdminView}
                    title={isAdminView ? 'Admin tidak dapat menyimpan favorit' : ''}
                    style={isAdminView ? { opacity: 0.45, cursor: 'not-allowed' } : {}}>
                    <span className="material-symbols-outlined">{isFav ? 'bookmark' : 'bookmark_border'}</span>
                    {isFav ? 'Tersimpan' : 'Simpan Favorit'}
                  </button>
                  {user && (
                    <button
                      className="mm-btn-outline"
                      onClick={!isAdminView ? () => setShowReviewModal(true) : undefined}
                      disabled={isAdminView}
                      title={isAdminView ? 'Admin tidak dapat menulis ulasan' : ''}
                      style={isAdminView ? { opacity: 0.45, cursor: 'not-allowed' } : {}}>
                      <span className="material-symbols-outlined">edit</span>
                      Tulis Ulasan
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column — Menu only */}
            <div className="col-12 col-lg-4">
              <div className="mm-panel">
                <div className="mm-panel-header">
                  <h3>Menu & Harga</h3>
                  {(place.min_price || place.max_price) && (
                    <span className="mm-price-range">
                      Rp{place.min_price ? Math.round(place.min_price/1000) : '?'}k–{place.max_price ? Math.round(place.max_price/1000) : '?'}k
                    </span>
                  )}
                </div>
                {menuCategories.length > 1 && (
                  <div className="mm-menu-tabs">
                    {menuCategories.map(cat => (
                      <button key={cat} className={`mm-tab-chip ${menuTab === cat ? 'active' : ''}`}
                        onClick={() => setMenuTab(cat)}>
                        {cat === 'all' ? 'Semua' : cat}
                      </button>
                    ))}
                  </div>
                )}
                <div className="mm-menu-list">
                  {filteredMenus.length === 0 ? (
                    <p className="mm-empty-text">Belum ada menu tersedia.</p>
                  ) : filteredMenus.map(menu => (
                    <div key={menu.id} className="mm-menu-item">
                      <div>
                        <span className="mm-menu-name">{menu.name}</span>
                        {menu.category && <span className="mm-menu-tag">{menu.category}</span>}
                      </div>
                      <div className="mm-menu-right">
                        <span className="mm-menu-price">Rp{Number(menu.price || 0).toLocaleString('id-ID')}</span>
                        <span className={`mm-avail-dot ${menu.is_available ? 'avail' : 'unavail'}`}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews — Full Width Below */}
          <div className="mm-panel mt-4">
            <div className="mm-panel-header">
              <h3>Ulasan Pengguna</h3>
              <span className="mm-review-count">{place.total_reviews || 0} ulasan</span>
            </div>
            <div className="mm-review-list">
              {reviews.length === 0 ? (
                <p className="mm-empty-text">Belum ada ulasan. Jadilah yang pertama!</p>
              ) : reviews.map(rev => (
                <div key={rev.id} className="mm-review-item">
                  <div className="mm-review-header">
                    <div className="mm-reviewer">
                      <div className="mm-reviewer-avatar" style={{ overflow: 'hidden', padding: 0 }}>
                        {rev.reviewer_avatar ? (
                          <img 
                            src={rev.reviewer_avatar.startsWith('http') ? rev.reviewer_avatar : `http://localhost:3000${rev.reviewer_avatar}`}
                            alt="" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.textContent = rev.reviewer_name?.charAt(0)?.toUpperCase() || 'U'; }}
                          />
                        ) : (
                          rev.reviewer_name?.charAt(0)?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <p className="mm-reviewer-name">{rev.reviewer_name || 'Anonim'}</p>
                        <p className="mm-review-date">{new Date(rev.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <StarDisplay rating={rev.rating} />
                  </div>
                  {rev.comment && <p className="mm-review-comment">"{rev.comment}"</p>}
                </div>
              ))}
            </div>
            {reviews.length > 0 && (
              <button className="mm-btn-ghost w-100">Lihat Semua Ulasan</button>
            )}
          </div>
        </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleCreateReview}
        loading={reviewLoading}
        title="Tulis Ulasan"
      />
    </>
  );

  if (isAdminView) {
    return (
      <AdminLayout title="Detail Tempat Makan">
        {content}
      </AdminLayout>
    );
  }

  return (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">
        {content}
      </main>
    </div>
  );
}
