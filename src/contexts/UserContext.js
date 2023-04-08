import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: null,
    username: null,
    email: null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const { user, setUser } = useContext(UserContext);
  return { user, setUser };
};

export { UserContext, UserProvider };
