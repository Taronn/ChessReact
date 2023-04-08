import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { isAuth, setIsAuth } = useContext(AuthContext);
  return { isAuth, setIsAuth };
};

export { AuthContext, AuthProvider };
