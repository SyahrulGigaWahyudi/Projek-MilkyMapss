import { useNavigate } from 'react-router-dom';
import { addFavorite, removeFavorite } from '../services/api';
import { useState } from 'react';

const GRADIENTS = [
  'linear-gradient(135deg, #FFB599 0%, #FF5F00 100%)',
  'linear-gradient(135deg, #FFDCC3 0%, #FD8B00 100%)',
  'linear-gradient(135deg, #ffb77d 0%, #ff5f00 100%)',
  'linear-gradient(135deg, #ffdf9a 0%, #fd8b00 100%)',
];

export default function FoodCard({ place, campus, isFavorite = false, favoriteId = null, onFavoriteChange, onUnfavorite }) {
  const navigate = useNavigate();
  const [favLoading, setFavLoading] = useState(false);
  const gradient = GRADIENTS[place.id % GRADIENTS.length];

  const toggleFav = async (e) => {
    e.stopPropagation();
    setFavLoading(true);
    try {
      if (isFavorite) {
        const idToRemove = favoriteId || place.favoriteId;
        if (idToRemove) {
          await removeFavorite(idToRemove);
          onFavoriteChange && onFavoriteChange(place.id, false, null);
          onUnfavorite && onUnfavorite(place.id);
        }
      } else {
        const res = await addFavorite({ food_place_id: place.id });
        const newFavId = res.data?.id || null;
        onFavoriteChange && onFavoriteChange(place.id, true, newFavId);
      }
    } catch {}
    setFavLoading(false);
  };

  return (
    <div className="mm-food-card" onClick={() => navigate(`/food/${place.id}`)}>
      <div className="mm-food-card-img" style={{ background: gradient }}>
        {place.thumbnail
          ? <img src={place.thumbnail} alt={place.name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
          : null}
        <span className="material-symbols-outlined mm-food-card-placeholder" style={{ display: place.thumbnail ? 'none' : 'block' }}>restaurant</span>
        <div className="mm-food-card-rating">
          <span className="material-symbols-outlined star">star</span>
          <span>{place.average_rating ? Number(place.average_rating).toFixed(1) : '–'}</span>
        </div>
        <button className={`mm-fav-btn ${isFavorite ? 'active' : ''}`} onClick={toggleFav} disabled={favLoading}>
          <span className="material-symbols-outlined">{isFavorite ? 'bookmark' : 'bookmark_border'}</span>
        </button>
      </div>
      <div className="mm-food-card-body">
        <h4 className="mm-food-card-name">{place.name}</h4>
        <div className="mm-food-card-meta">
          {place.distance_meters != null && (
            <span className="mm-meta-item">
              <span className="material-symbols-outlined">directions_walk</span>
              {place.distance_meters < 1000
                ? `${Math.round(place.distance_meters)}m`
                : `${(place.distance_meters / 1000).toFixed(1)}km`}
            </span>
          )}
          {(place.min_price || place.max_price) && (
            <span className="mm-meta-item">
              <span className="material-symbols-outlined">payments</span>
              Rp{place.min_price ? `${Math.round(place.min_price / 1000)}k` : '?'}
              {place.max_price ? `–${Math.round(place.max_price / 1000)}k` : ''}
            </span>
          )}
        </div>
        <button className="mm-btn-outline w-100 mt-2" onClick={(e) => { e.stopPropagation(); navigate(`/food/${place.id}`); }}>
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
