import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFoodPlaceById, createFoodPlace, updateFoodPlace, getCampuses } from '../services/api';
import { AdminLayout } from './admin/AdminDashboard';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const previewIcon = new L.DivIcon({
  html: `<div style="background:#ff5f00;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>`,
  className: '', iconAnchor: [9, 9],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 16, { animate: true });
  }, [center, map]);
  return null;
}

/** Parse "lat, long" string into { lat, lng } or null */
function parseCoords(str) {
  if (!str) return null;
  const parts = str.split(',').map(s => s.trim());
  if (parts.length !== 2) return null;
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  if (isNaN(lat) || isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

export default function AdminFoodPlaceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', description: '', address: '',
    coordinates: '', // single field: "lat, long"
    gmaps_link: '',
    campus_location_id: '', image_url: '',
    opening_time: '', closing_time: ''
  });
  const [campuses, setCampuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getCampuses().then(res => setCampuses(res.data)).catch(() => {});
    if (isEdit) {
      setLoading(true);
      getFoodPlaceById(id).then(res => {
        const d = res.data;
        const coords = (d.latitude && d.longitude) ? `${d.latitude}, ${d.longitude}` : '';
        setForm({
          name: d.name || '', description: d.description || '', address: d.detail_location || '',
          coordinates: coords,
          gmaps_link: d.gmaps_link || '',
          campus_location_id: d.campus_location_id || '', image_url: d.thumbnail || '',
          opening_time: d.opening_time || '', closing_time: d.closing_time || ''
        });
      }).catch(() => setError('Gagal mengambil data')).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  // Parse coordinates for preview
  const parsedCoords = useMemo(() => parseCoords(form.coordinates), [form.coordinates]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');

    // Validate coordinates
    if (form.coordinates && !parsedCoords) {
      setError('Format koordinat tidak valid. Gunakan format: -6.2868893, 106.8529248');
      setLoading(false);
      return;
    }

    try {
      const payload = { ...form };

      // Parse coordinates into lat/long
      if (parsedCoords) {
        payload.latitude = parsedCoords.lat;
        payload.longitude = parsedCoords.lng;
      } else {
        delete payload.latitude;
        delete payload.longitude;
      }
      delete payload.coordinates;

      // Map address to detail_location
      payload.detail_location = payload.address;
      delete payload.address;

      // Map image_url state to thumbnail field expected by backend
      if (payload.image_url) {
        payload.thumbnail = payload.image_url;
      }
      delete payload.image_url;

      if (isEdit) await updateFoodPlace(id, payload);
      else await createFoodPlace(payload);
      setSuccess('Data berhasil disimpan!');
      setTimeout(() => navigate('/admin/food-places'), 800);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Gagal menyimpan data');
    } finally { setLoading(false); }
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Tempat Makan' : 'Tambah Tempat Makan'}>
      {/* Back button */}
      <button className="mm-back-link" onClick={() => navigate('/admin/food-places')}>
        <span className="material-symbols-outlined">arrow_back</span>
        Kembali ke Daftar
      </button>

      {error && <div className="mm-toast error"><span className="material-symbols-outlined">error</span>{error}</div>}
      {success && <div className="mm-toast success"><span className="material-symbols-outlined">check_circle</span>{success}</div>}

      <form onSubmit={handleSubmit} className="mm-form-grid">
        {/* Left Column - Main Info */}
        <div className="mm-form-section">
          <div className="mm-form-section-header">
            <div className="mm-form-section-icon"><span className="material-symbols-outlined">storefront</span></div>
            <div>
              <h3>Informasi Utama</h3>
              <p>Detail dasar tentang tempat makan</p>
            </div>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">
              Nama Tempat Makan <span className="mm-required">*</span>
            </label>
            <div className="mm-form-input-wrap">
              <span className="material-symbols-outlined mm-form-input-icon">restaurant</span>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                required placeholder="Contoh: Warteg Kharisma Bahari" />
            </div>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              rows="4" placeholder="Ceritakan tentang tempat makan ini, suasana, menu andalan..." />
          </div>

          <div className="mm-form-row">
            <div className="mm-form-field">
              <label className="mm-form-label">Jam Buka</label>
              <div className="mm-form-input-wrap">
                <span className="material-symbols-outlined mm-form-input-icon">schedule</span>
                <input type="time" value={form.opening_time}
                  onChange={e => setForm({...form, opening_time: e.target.value})} />
              </div>
            </div>
            <div className="mm-form-field">
              <label className="mm-form-label">Jam Tutup</label>
              <div className="mm-form-input-wrap">
                <span className="material-symbols-outlined mm-form-input-icon">schedule</span>
                <input type="time" value={form.closing_time}
                  onChange={e => setForm({...form, closing_time: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">
              Alamat Lengkap <span className="mm-required">*</span>
            </label>
            <div className="mm-form-input-wrap">
              <span className="material-symbols-outlined mm-form-input-icon">location_on</span>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                required placeholder="Jl. Contoh No. 123, Jakarta Selatan" />
            </div>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">
              Kampus Terdekat <span className="mm-required">*</span>
            </label>
            <div className="mm-form-input-wrap">
              <span className="material-symbols-outlined mm-form-input-icon">school</span>
              <select value={form.campus_location_id} onChange={e => setForm({...form, campus_location_id: e.target.value})} required>
                <option value="">— Pilih Kampus —</option>
                {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column - Location & Media */}
        <div className="mm-form-section">
          <div className="mm-form-section-header">
            <div className="mm-form-section-icon accent"><span className="material-symbols-outlined">pin_drop</span></div>
            <div>
              <h3>Lokasi & Media</h3>
              <p>Koordinat peta, link Google Maps, dan gambar</p>
            </div>
          </div>

          {/* Combined Coordinates Field */}
          <div className="mm-form-field">
            <label className="mm-form-label">
              Koordinat (Latitude, Longitude) <span className="mm-required">*</span>
            </label>
            <div className="mm-form-input-wrap">
              <span className="material-symbols-outlined mm-form-input-icon">my_location</span>
              <input type="text" value={form.coordinates}
                onChange={e => setForm({...form, coordinates: e.target.value})}
                placeholder="-6.2868893, 106.8529248"
                required />
            </div>
            {form.coordinates && !parsedCoords && (
              <p className="mm-form-error">Format tidak valid. Contoh: -6.2868893, 106.8529248</p>
            )}
            {parsedCoords && (
              <p className="mm-form-success">
                ✓ Lat: {parsedCoords.lat.toFixed(8)}, Long: {parsedCoords.lng.toFixed(8)}
              </p>
            )}
          </div>

          <div className="mm-form-tip">
            <span className="material-symbols-outlined">lightbulb</span>
            <span>Buka Google Maps → klik kanan pada lokasi → salin koordinat → paste langsung di sini.</span>
          </div>

          {/* Leaflet Preview Map */}
          {parsedCoords && (
            <div className="mm-form-map-preview">
              <label className="mm-form-label" style={{ marginBottom: '0.5rem' }}>Preview Lokasi</label>
              <div style={{ height: 200, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border, #e0e0e0)' }}>
                <MapContainer
                  center={[parsedCoords.lat, parsedCoords.lng]}
                  zoom={16}
                  style={{ width: '100%', height: '100%' }}
                  scrollWheelZoom={false}
                  dragging={false}
                  zoomControl={false}
                >
                  <MapUpdater center={[parsedCoords.lat, parsedCoords.lng]} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[parsedCoords.lat, parsedCoords.lng]} icon={previewIcon} />
                </MapContainer>
              </div>
            </div>
          )}

          {/* Google Maps Link Field */}
          <div className="mm-form-field" style={{ marginTop: '1rem' }}>
            <label className="mm-form-label">Link Google Maps (opsional)</label>
            <div className="mm-form-input-wrap">
              <span className="material-symbols-outlined mm-form-input-icon">map</span>
              <input type="url" value={form.gmaps_link}
                onChange={e => setForm({...form, gmaps_link: e.target.value})}
                placeholder="https://maps.app.goo.gl/3oyH3T6kZKPFiKqW7" />
            </div>
            <p className="mm-form-hint">Jika diisi, tombol Navigasi akan langsung membuka link ini (lebih akurat).</p>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">URL Gambar Tempat Makan</label>
            <div className="mm-form-input-wrap">
              <span className="material-symbols-outlined mm-form-input-icon">link</span>
              <input type="url" value={form.image_url}
                onChange={e => setForm({...form, image_url: e.target.value})}
                placeholder="https://contoh.com/gambar.jpg" />
            </div>
          </div>

          {form.image_url && (
            <div className="mm-form-preview">
              <img src={form.image_url} alt="Preview" onError={e => e.target.style.display='none'} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mm-form-footer">
          <button type="button" className="mm-form-btn cancel" onClick={() => navigate('/admin/food-places')}>
            Batal
          </button>
          <button type="submit" className="mm-form-btn submit" disabled={loading}>
            {loading ? (
              <><span className="mm-spinner"></span> Menyimpan...</>
            ) : (
              <><span className="material-symbols-outlined">save</span> {isEdit ? 'Update Data' : 'Simpan Data'}</>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
