import { createContext, useContext } from 'react';

export const NavContext = createContext<NavContextType | null>(null);

export const useNav = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNav must be used within a NavProvider');
  }
  return context;
};
