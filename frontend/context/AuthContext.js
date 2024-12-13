import { createContext, useContext, useState } from "react";

export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

interface AuthProps {
  authState: {authenticated: Boolean | null; username: string |null; role: Role| null};
  inLogin: (username: String, password: string) => void;
  inLogout: () => void;
}

const AuthContext = createContext<Partial<AuthProps>>({});

export const useAuth = () => {
  return useContext(AuthContext);
}

export const AuthProvider = ({children}: any) => {
  const [authState, setAuthState] = useState<{
    authenticated: Boolean | null,
    username :string | null,
    role: Role | null,
  }>({
    authenticated: null,
    username: null,
    role: null,
  })

  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setAuthState({
        authenticated: true,
        username: username,
        role: Role.ADMIN,
      });
    }else if (username === 'user' && password === 'user'){
      setAuthState({
        authenticated: true,
        username: username,
        role: Role.USER,
      });
    } else {
      alert('Invalid username or password')
    }
  };
  const logout = async () => {
    setAuthState({
      authenticated: false,
        username: null,
        role: null,
    })
  };

  const value = {
    onLogin: login,
    onLogout: logout,
    authState,
  };

  return <AuthContext.Provider value= {value}>{children}</AuthContext.Provider>
}

