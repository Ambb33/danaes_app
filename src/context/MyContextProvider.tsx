
// context/MyContextProvider.tsx
'use client'
import React, { createContext, useState, ReactNode } from 'react';

interface MyContextType {
  value: string;
  setValue: (value: string) => void;
}

interface MyContextProviderProps {
  children: ReactNode;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

export const MyContextProvider: React.FC<MyContextProviderProps> = ({ children }) => {
  const [value, setValue] = useState("Hello, World!");

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext };
