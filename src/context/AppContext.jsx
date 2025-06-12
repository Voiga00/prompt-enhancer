import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const [promptData, setPromptData] = useState({});

  return (
    <AppContext.Provider value={{ apiKey, setApiKey, promptData, setPromptData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
