import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  // When register is done, close it and open login
  const switchToLogin = () => {
    closeRegisterModal();
    openLoginModal();
  };

  return (
    <ModalContext.Provider value={{ 
      isLoginModalOpen, isRegisterModalOpen,
      openLoginModal, closeLoginModal,
      openRegisterModal, closeRegisterModal,
      switchToLogin
    }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  return useContext(ModalContext);
};