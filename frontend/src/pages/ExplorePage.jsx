import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getFoodPlaces, getCampuses, getFavorites, addFavorite, removeFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SideNav from '../components/SideNav';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const campusIcon = new L.DivIcon({
  html: `<div style="background:#ff5f00;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  className: '', iconAnchor: [8, 8],
});

const foodIcon = new L.DivIcon({
  html: `<div style="background:#a63b00;width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
  className: '', iconAnchor: [6, 6],
});

const SORT_OPTIONS = [
  { value: 'distance', label: 'Terdekat' },
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'price_asc', label: 'Harga Terjangkau' },
];

function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom ?? map.getZoom(), { animate: true });
  }, [center, zoom, map]);
  return null;
}

export default function ExplorePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('distance');
  const [selected, setSelected] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    getCampuses().then(res => {
      const list = res.data;
      setCampuses(list);
      if (list.length > 0) setSelectedCampus(list[0]);
    }).catch(() => {
      const fallback = [
        { id: 1, name: 'Kampus A STT-NF', address: 'Jl. Situ Babakan', latitude: -6.3627739,  longitude: 106.8444527 },
        { id: 2, name: 'Kampus B STT-NF', address: 'Jl. Lenteng Agung', latitude: -6.352945 , longitude: 106.832631 },
      ];
      setCampuses(fallback);
      setSelectedCampus(fallback[0]);
    });

  }, []);

  useEffect(() => {
    if (user) {
      getFavorites({ user_id: user.id }).then(res => setFavorites(res.data?.data || res.data || []));
    }
  }, [user]);

  useEffect(() => {
    if (!selectedCampus) return;
    setLoading(true);
    setSelected(null);
    getFoodPlaces({ campus_location_id: selectedCampus.id, search, sort })
      .then(res => {
        const data = res.data?.data || res.data || [];
        setPlaces(Array.isArray(data) ? data : []);
      })
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, [selectedCampus, sort, search]);

  const filtered = places.filter(p =>
    !search ||
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  const campusCenter = selectedCampus
    ? [Number(selectedCampus.latitude), Number(selectedCampus.longitude)]
    : [-6.3332, 106.8204];

  const mapCenter = selected?.latitude && selected?.longitude
    ? [Number(selected.latitude), Number(selected.longitude)]
    : campusCenter;

  const handleToggleFav = async (e, place) => {
    e.stopPropagation();
    const fav = favorites.find(f => f.id === place.id);
    const isFav = !!fav;
    try {
      if (isFav) {
        await removeFavorite(fav.favorite_id);
        setFavorites(prev => prev.filter(f => f.favorite_id !== fav.favorite_id));
      } else {
        const res = await addFavorite({ food_place_id: place.id });
        setFavorites(prev => [...prev, { id: place.id, favorite_id: res.data.id }]);
      }
    } catch (err) {}
  };

  return (
    <div className="mm-app-layout">
      <SideNav />
      <main className="mm-main-content">
        <header className="mm-topbar">
          <h1 className="mm-topbar-title">Cari Tempat Makan</h1>
          <div className="mm-topbar-actions">
            <div className="mm-campus-badge">
              <span className="material-symbols-outlined">location_on</span>
              <select value={selectedCampus?.id || ''} onChange={e => {
                const c = campuses.find(x => x.id == e.target.value);
                setSelectedCampus(c);
              }}>
                {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </header>

        <div className="mm-explore-layout">
          {/* Left: List */}
          <div className="mm-explore-list">
            <div className="mm-search-box">
              <span className="material-symbols-outlined">search</span>
              <input placeholder="Cari tempat makan atau menu..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="mm-filter-chips">
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value}
                  className={`mm-chip ${sort === opt.value ? 'active' : ''}`}
                  onClick={() => setSort(opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>

            <p className="mm-result-count">
              <strong>{filtered.length}</strong> tempat makan ditemukan
            </p>

            <div className="mm-place-list d-flex flex-column gap-3">
              {loading ? (
                [1,2,3].map(i => <div key={i} className="mm-skeleton-card tall"></div>)
              ) : filtered.length === 0 ? (
                <div className="mm-empty-state">
                  <span className="material-symbols-outlined">search_off</span>
                  <p>Tidak ada tempat makan yang ditemukan.</p>
                </div>
              ) : filtered.map(place => {
                const isFav = favorites.some(f => f.id === place.id);
                return (
                  <div key={place.id}
                    className={`mm-place-card ${selected?.id === place.id ? 'active' : ''}`}
                    onClick={() => setSelected(place)}>
                    <div className="mm-place-card-img"
                      style={{ background: `linear-gradient(135deg, #FFB599 0%, #FF5F00 100%)` }}>
                      {place.thumbnail && <img src={place.thumbnail} alt={place.name} onError={(e) => e.target.style.display = 'none'} />}
                    </div>
                    <div className="mm-place-card-body">
                      <div className="mm-place-card-header">
                        <h3>{place.name}</h3>
                        <div className="mm-rating-badge">
                          <span className="material-symbols-outlined star-sm">star</span>
                          <span>{place.average_rating ? Number(place.average_rating).toFixed(1) : '–'}</span>
                        </div>
                      </div>
                      <div className="mm-place-card-meta">
                        {place.distance_meters != null && (
                          <span><span className="material-symbols-outlined">directions_walk</span>
                            {place.distance_meters < 1000 ? `${Math.round(place.distance_meters)}m` : `${(place.distance_meters/1000).toFixed(1)}km`}
                          </span>
                        )}
                        {place.price_range && (
                          <span><span className="material-symbols-outlined">payments</span>
                            {place.price_range}
                          </span>
                        )}
                      </div>
                      <div className="mm-place-card-actions">
                        <button className="mm-btn-primary sm" onClick={e => { e.stopPropagation(); navigate(`/food/${place.id}`); }}>
                          Detail
                        </button>
                        {(place.gmaps_link || (place.latitude && place.longitude)) && (
                          <button className="mm-btn-outline sm" onClick={e => {
                            e.stopPropagation();
                            const url = place.gmaps_link
                              ? place.gmaps_link
                              : `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
                            window.open(url, '_blank');
                          }}>
                            Navigasi
                          </button>
                        )}
                        <button className="mm-icon-btn border" style={{ color: isFav ? '#ff5f00' : 'var(--text)' }} onClick={(e) => handleToggleFav(e, place)}>
                          <span className="material-symbols-outlined">{isFav ? 'bookmark' : 'bookmark_border'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Map */}
          <div className="mm-explore-map">
            <MapContainer
              center={mapCenter}
              zoom={15}
              style={{ width: '100%', height: '100%' }}
              ref={mapRef}
            >
              <MapUpdater center={mapCenter} zoom={selected ? undefined : 15} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Campus marker */}
              {selectedCampus?.latitude && (
                <>
                  <Circle center={selectedCampus.latitude ? [Number(selectedCampus.latitude), Number(selectedCampus.longitude)] : mapCenter} radius={500} pathOptions={{ color: '#ff5f00', fillColor: '#ff5f00', fillOpacity: 0.05 }} />
                  <Marker position={selectedCampus.latitude ? [Number(selectedCampus.latitude), Number(selectedCampus.longitude)] : mapCenter} icon={campusIcon}>
                    <Popup>{selectedCampus.name}</Popup>
                  </Marker>
                </>
              )}
              {/* Food place markers */}
              {filtered.filter(p => p.latitude && p.longitude).map(place => (
                <Marker key={place.id} position={[Number(place.latitude), Number(place.longitude)]} icon={foodIcon}
                  eventHandlers={{ click: () => setSelected(place) }}>
                  <Popup>
                    <strong>{place.name}</strong><br />
                    ⭐ {place.average_rating ? Number(place.average_rating).toFixed(1) : '–'}<br />
                    <button onClick={() => navigate(`/food/${place.id}`)} style={{ color: '#ff5f00', border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}>
                      Lihat Detail →
                    </button>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
