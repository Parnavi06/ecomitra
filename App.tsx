
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole, AuthState } from './types';
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import OperatorDashboard from './pages/OperatorDashboard';
import { supabase } from './src/lib/supabaseClient';

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
    token: null, // Token will be managed by Supabase session
    isAuthenticated: false
  });

  const handleSession = async (session: any) => {
    const { user } = session;

    // Fetch user role from 'users' table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role, name, avatar, bio')
      .eq('id', user.id)
      .single();

    if (userData) {
      const authUser: User = {
        id: user.id,
        email: user.email || '',
        name: userData.name || user.email?.split('@')[0] || 'User',
        role: userData.role as UserRole,
        avatar: userData.avatar,
        bio: userData.bio
      };

      setAuth({
        user: authUser,
        token: session.access_token,
        isAuthenticated: true
      });
      localStorage.setItem('token', session.access_token);
      localStorage.setItem('user', JSON.stringify(authUser));
    } else if (userError) {
      console.error('Error fetching user profile:', userError);
      // Fallback or handle error
      setAuth({
        user: {
          id: user.id,
          email: user.email || '',
          name: user.email?.split('@')[0] || 'User',
          role: UserRole.GUEST, // Default to GUEST if role not found
          avatar: null,
          bio: null
        },
        token: session.access_token,
        isAuthenticated: true
      });
      localStorage.setItem('token', session.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email || '',
        name: user.email?.split('@')[0] || 'User',
        role: UserRole.GUEST,
        avatar: null,
        bio: null
      }));
    }
  };

  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await handleSession(session);
      }
    };
    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleSession(session);
      } else {
        setAuth({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) throw error;
    if (data.session) {
      await handleSession(data.session);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
