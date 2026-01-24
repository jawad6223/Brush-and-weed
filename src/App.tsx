import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import AdminLogin from './components/AdminLogin';
import AdminEditor from './components/AdminEditor';
import CityPage from "./pages/CityPage";
import { Route, Routes } from "react-router-dom";

function AppRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (currentPath === '/admin/login' || currentPath === '/admin') {
    if (!user) {
      return <AdminLogin />;
    }
    return <AdminEditor />;
  }

  return <HomePage />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/:city" element={<CityPage />} />
        <Route path="*" element={<AppRouter />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
