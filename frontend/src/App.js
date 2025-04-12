import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderList from './pages/ProviderList';
import ProviderDetail from './pages/ProviderDetail';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import ProviderDashboard from './pages/ProviderDashboard';
import { loadUser } from './store/authSlice';

// Protected route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);
  
  useEffect(() => {
    // Check if user is logged in by trying to load user data
    dispatch(loadUser());
  }, [dispatch]);
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading MedPort...</p>
      </div>
    );
  }
  
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/providers" element={<ProviderList />} />
          <Route path="/providers/:providerId" element={<ProviderDetail />} />
          <Route path="/checkout/:bookingId" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/provider-dashboard" element={
            <ProtectedRoute allowedRoles={['provider', 'admin']}>
              <ProviderDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
