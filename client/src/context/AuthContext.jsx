import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || null);
  const [username, setUsername] = useState(() => localStorage.getItem('admin_user') || null);

  const login = (tok, user) => {
    setToken(tok);
    setUsername(user);
    localStorage.setItem('admin_token', tok);
    localStorage.setItem('admin_user', user);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
