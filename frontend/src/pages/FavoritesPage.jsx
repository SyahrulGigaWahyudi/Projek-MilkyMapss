import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';
import FoodCard from '../components/FoodCard';

export default function FavoritesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = () => {
    if (!user) return;
    setLoading(true);
    getFavorites({ user_id: user.id })
      .then(res => setFavorites(res.data?.data || res.data || []))
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadFavorites(); }, [user]);

  const handleUnfavorite = (placeId) => {
    setFavorites(prev => prev.filter(f => f.food_place_id !== placeId && f.id !== placeId));
  };

  return (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">
        <header className="mm-topbar">
          <h1 className="mm-topbar-title">Favorit Saya</h1>
        </header>
        <div className="mm-page-content">
          <p className="mm-page-subtitle mb-4">Tempat makan yang sudah kamu simpan.</p>

          {loading ? (
            <div className="row g-3">
              {[1,2,3,4].map(i => <div key={i} className="col-12 col-md-4"><div className="mm-skeleton-card"></div></div>)}
            </div>
          ) : favorites.length === 0 ? (
            <div className="mm-empty-state">
              <span className="material-symbols-outlined">bookmark_border</span>
              <h3>Belum Ada Favorit</h3>
              <p>Simpan tempat makan favoritmu agar mudah ditemukan lagi.</p>
              <button className="mm-btn-primary mt-3" onClick={() => navigate('/explore')}>
                Cari Tempat Makan
              </button>
            </div>
          ) : (
            <div className="row g-3">
              {favorites.map(fav => (
                <div key={fav.favorite_id} className="col-12 col-md-4">
                  <FoodCard
                    place={fav}
                    isFavorite={true}
                    favoriteId={fav.favorite_id}
                    onFavoriteChange={(placeId, isFav) => {
                      if (!isFav) handleUnfavorite(placeId);
                    }}
                    onUnfavorite={handleUnfavorite}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
