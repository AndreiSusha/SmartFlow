import React, { createContext, useState, useContext } from 'react';

// Create Context
const UserContext = createContext();

// Create a custom hook to access user context
export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);

  // Function to remove a user from the list after deletion
  const removeUser = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <UserContext.Provider value={{ users, setUsers,userDetails, setUserDetails, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};
