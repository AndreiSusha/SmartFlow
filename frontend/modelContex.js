import React, { createContext, useContext, useState } from "react";

// Create a Context
const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <ModalContext.Provider value={{ isModalVisible, setModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
