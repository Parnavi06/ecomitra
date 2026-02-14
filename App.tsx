
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole, AuthState } from './types';
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import OperatorDashboard from './pages/OperatorDashboard';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token')
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setAuth(prev => ({ ...prev, user: JSON.parse(savedUser), isAuthenticated: true }));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const { api } = await import('./services/api');
    const response = await api.login(email, pass);
    setAuth({
      user: response.user,
      token: response.token,
      isAuthenticated: true
    });
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/admin/*"
            element={
              auth.isAuthenticated && auth.user?.role === UserRole.ADMIN
                ? <AdminDashboard />
                : <Navigate to="/login" />
            }
          />

          <Route
            path="/operator/*"
            element={
              auth.isAuthenticated && auth.user?.role === UserRole.OPERATOR
                ? <OperatorDashboard />
                : <Navigate to="/login" />
            }
          />


          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
