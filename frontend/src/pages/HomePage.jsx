import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getFoodPlaces, getCampuses, getFavorites } from '../services/api';
import SideNav from '../components/SideNav';
import FoodCard from '../components/FoodCard';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getFavorites({ user_id: user.id }).then(res => {
        const favs = res.data?.data || res.data || [];
        setFavorites(favs);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    getCampuses().then(res => {
      setCampuses(res.data);
      if (res.data.length > 0) setSelectedCampus(res.data[0]);
    }).catch(() => {
      // Fallback kampus jika API belum ada
      const fallback = [
        { id: 1, name: 'Kampus A STT-NF', address: 'Jl. Situ Babakan, Jagakarsa', latitude: -6.3332, longitude: 106.8204 },
        { id: 2, name: 'Kampus B STT-NF', address: 'Jl. Lenteng Agung Raya', latitude: -6.3226, longitude: 106.8296 },
      ];
      setCampuses(fallback);
      setSelectedCampus(fallback[0]);
    });
  }, []);

  useEffect(() => {
    if (!selectedCampus) return;
    setLoading(true);
    getFoodPlaces({ campus_location_id: selectedCampus.id, limit: 6 })
      .then(res => setRecommendations(res.data?.data || res.data || []))
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false));
  }, [selectedCampus]);

  const campusIcons = ['school', 'apartment', 'location_city', 'domain'];

  return (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">
        {/* Top bar */}
        <header className="mm-topbar">
          <div className="mm-topbar-greeting">
            <span className="material-symbols-outlined text-primary">waving_hand</span>
          </div>
          <div className="mm-topbar-actions">
            <button className="mm-icon-btn">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="mm-avatar-sm" onClick={() => navigate('/profile')}>
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <div className="mm-page-content">
          {/* Welcome */}
          <section className="mm-welcome-section">
            <h2 className="mm-page-title">Halo, {user?.full_name?.split(' ')[0] || user?.username}! 👋</h2>
            <p className="mm-page-subtitle">Pilih lokasi kampus untuk melihat rekomendasi tempat makan terdekat.</p>
          </section>

          {/* Campus Selection */}
          <section className="mb-4">
            <div className="row g-3">
              {campuses.map((campus, i) => (
                <div key={campus.id} className="col-12 col-md-6">
                  <button
                    className={`mm-campus-card w-100 ${selectedCampus?.id === campus.id ? 'active' : ''}`}
                    onClick={() => setSelectedCampus(campus)}
                  >
                    {selectedCampus?.id === campus.id && (
                      <div className="mm-campus-check">
                        <span className="material-symbols-outlined">check</span>
                      </div>
                    )}
                    <div className="mm-campus-icon">
                      <span className="material-symbols-outlined">{campusIcons[i] || 'school'}</span>
                    </div>
                    <div className="mm-campus-info">
                      <h3>{campus.name}</h3>
                      <p>
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                        {campus.address}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <section>
            <div className="mm-section-header">
              <h3 className="mm-section-title">Rekomendasi Cepat</h3>
              <button className="mm-link" onClick={() => navigate('/explore')}>Lihat Semua</button>
            </div>

            {loading ? (
              <div className="mm-loading-grid">
                {[1,2,3].map(i => <div key={i} className="mm-skeleton-card"></div>)}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="mm-empty-state">
                <span className="material-symbols-outlined">restaurant_menu</span>
                <p>Belum ada data tempat makan untuk kampus ini.</p>
              </div>
            ) : (
              <div className="row g-3">
                {recommendations.map(place => {
                  const favEntry = favorites.find(f => f.id === place.id);
                  return (
                    <div key={place.id} className="col-12 col-md-4">
                      <FoodCard
                        place={place}
                        campus={selectedCampus}
                        isFavorite={!!favEntry}
                        favoriteId={favEntry?.favorite_id || null}
                        onFavoriteChange={(placeId, isFav, newFavId) => {
                          if (isFav) {
                            setFavorites(prev => [...prev, { id: placeId, favorite_id: newFavId }]);
                          } else {
                            setFavorites(prev => prev.filter(f => f.id !== placeId));
                          }
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
