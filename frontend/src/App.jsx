import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/RouteGuards';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import FoodDetailPage from './pages/FoodDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import WriteReviewPage from './pages/WriteReviewPage';
import ReviewHistoryPage from './pages/ReviewHistoryPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFoodPlaces from './pages/admin/AdminFoodPlaces';
import AdminMenus from './pages/admin/AdminMenus';
import AdminReviews from './pages/admin/AdminReviews';
import AdminFoodPlaceForm from './pages/AdminFoodPlaceForm';
import AdminMenuForm from './pages/AdminMenuForm';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />

          {/* Guest only */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* User routes */}
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
          <Route path="/food/:id" element={<ProtectedRoute><FoodDetailPage /></ProtectedRoute>} />
          <Route path="/food/:id/review" element={<ProtectedRoute><WriteReviewPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/profile/reviews" element={<ProtectedRoute><ReviewHistoryPage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/food-places" element={<AdminRoute><AdminFoodPlaces /></AdminRoute>} />
          <Route path="/admin/food-places/:id" element={<AdminRoute><FoodDetailPage /></AdminRoute>} />
          <Route path="/admin/food-places/add" element={<AdminRoute><AdminFoodPlaceForm /></AdminRoute>} />
          <Route path="/admin/food-places/:id/edit" element={<AdminRoute><AdminFoodPlaceForm /></AdminRoute>} />
          
          <Route path="/admin/menus" element={<AdminRoute><AdminMenus /></AdminRoute>} />
          <Route path="/admin/menus/add" element={<AdminRoute><AdminMenuForm /></AdminRoute>} />
          <Route path="/admin/menus/:id/edit" element={<AdminRoute><AdminMenuForm /></AdminRoute>} />
          
          <Route path="/admin/reviews" element={<AdminRoute><AdminReviews /></AdminRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="mm-404">
              <h1>404</h1>
              <p>Halaman tidak ditemukan.</p>
              <a href="/" className="mm-btn-primary">Kembali ke Beranda</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
