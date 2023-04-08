import { createContext, useContext, useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const SignalRContext = createContext();

const SignalRProvider = ({ children }) => {
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7084/hubs/chess')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  return (
    <SignalRContext.Provider value={{ connection }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const { connection } = useContext(SignalRContext);
  return { connection };
};

export { SignalRContext, SignalRProvider };
