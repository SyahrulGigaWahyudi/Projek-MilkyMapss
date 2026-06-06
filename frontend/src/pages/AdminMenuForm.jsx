import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMenuById, createMenu, updateMenu, getFoodPlaces } from '../services/api';
import { AdminLayout } from './admin/AdminDashboard';

export default function AdminMenuForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    food_place_id: '', name: '', description: '',
    price: '', image_url: '', is_available: true
  });
  const [foodPlaces, setFoodPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getFoodPlaces().then(res => {
      const data = res.data?.data || res.data;
      setFoodPlaces(Array.isArray(data) ? data : []);
    }).catch(() => {});
    if (isEdit) {
      setLoading(true);
      getMenuById(id).then(res => {
        const d = res.data;
        setForm({ food_place_id: d.food_place_id||'', name: d.name||'',
          description: d.description||'', price: d.price||'',
          image_url: d.image||'', is_available: d.is_available ?? true });
      }).catch(() => setError('Gagal mengambil data menu')).finally(() => setLoading(false));
    }
  }, [id, isEdit]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      if (!form.food_place_id) throw new Error('Tempat makan harus dipilih');
      
      const payload = { ...form };
      if (payload.image_url) {
        payload.image = payload.image_url;
      }
      delete payload.image_url;
      
      if (isEdit) await updateMenu(id, payload);
      else await createMenu(payload);
      setSuccess('Menu berhasil disimpan!');
      setTimeout(() => navigate('/admin/menus'), 800);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Gagal menyimpan data');
    } finally { setLoading(false); }
  };

  const formatRupiah = (val) => {
    if (!val) return '';
    return 'Rp ' + Number(val).toLocaleString('id-ID');
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Menu' : 'Tambah Menu Baru'}>
      <button className="mm-back-link" onClick={() => navigate('/admin/menus')}>
        <span className="material-symbols-outlined">arrow_back</span>
        Kembali ke Daftar
      </button>

      {error && <div className="mm-toast error"><span className="material-symbols-outlined">error</span>{error}</div>}
      {success && <div className="mm-toast success"><span className="material-symbols-outlined">check_circle</span>{success}</div>}

      <form onSubmit={handleSubmit} className="mm-form-grid">
        {/* Left - Menu Info */}
        <div className="mm-form-section">
          <div className="mm-form-section-header">
            <div className="mm-form-section-icon"><span className="material-symbols-outlined">restaurant_menu</span></div>
            <div>
              <h3>Detail Menu</h3>
              <p>Informasi tentang menu makanan</p>
            </div>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">
              Tempat Makan <span className="mm-required">*</span>
            </label>
            <div className="mm-form-input-wrap">
              <span className="material-symbols-outlined mm-form-input-icon">storefront</span>
              <select value={form.food_place_id} onChange={e => setForm({...form, food_place_id: e.target.value})} required>
                <option value="">— Pilih Tempat Makan —</option>
                {foodPlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">
              Nama Menu <span className="mm-required">*</span>
            </label>
            <div className="mm-form-input-wrap">
              <span className="material-symbols-outlined mm-form-input-icon">lunch_dining</span>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                required placeholder="Contoh: Nasi Goreng Spesial" />
            </div>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              rows="3" placeholder="Bahan utama, porsi, level kepedasan..." />
          </div>
        </div>

        {/* Right - Price & Media */}
        <div className="mm-form-section">
          <div className="mm-form-section-header">
            <div className="mm-form-section-icon accent"><span className="material-symbols-outlined">payments</span></div>
            <div>
              <h3>Harga & Media</h3>
              <p>Harga jual dan foto menu</p>
            </div>
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">
              Harga <span className="mm-required">*</span>
            </label>
            <div className="mm-form-input-wrap">
              <span className="mm-form-input-prefix">Rp</span>
              <input type="number" min="0" value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                required placeholder="15000" className="has-prefix" />
            </div>
            {form.price && (
              <span className="mm-form-hint">{formatRupiah(form.price)}</span>
            )}
          </div>

          <div className="mm-form-field">
            <label className="mm-form-label">URL Gambar Menu</label>
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

          <div className="mm-form-field">
            <label className="mm-form-toggle-label">
              <div className="mm-toggle-wrap">
                <input type="checkbox" checked={form.is_available}
                  onChange={e => setForm({...form, is_available: e.target.checked})} />
                <div className="mm-toggle-track">
                  <div className="mm-toggle-thumb"></div>
                </div>
              </div>
              <div>
                <span className="mm-toggle-text">Menu Tersedia</span>
                <span className="mm-toggle-desc">{form.is_available ? 'Ditampilkan ke pengguna' : 'Disembunyikan dari pengguna'}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="mm-form-footer">
          <button type="button" className="mm-form-btn cancel" onClick={() => navigate('/admin/menus')}>
            Batal
          </button>
          <button type="submit" className="mm-form-btn submit" disabled={loading}>
            {loading ? (
              <><span className="mm-spinner"></span> Menyimpan...</>
            ) : (
              <><span className="material-symbols-outlined">save</span> {isEdit ? 'Update Menu' : 'Simpan Menu'}</>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
