import React, { createContext, useState, useContext } from 'react';

// Create Context
const UserContext = createContext();

// Create a custom hook to access user context
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};
