import Lobby from '../components/Lobby';
import { useEffect } from 'react';
import { useSignalR } from '../contexts/SignalRContext';

function PlayPage() {
  const { connection } = useSignalR();

  useEffect(() => {
    if (connection.state === 'Disconnected') {
      connection.start();
    }

    return () => {
      connection.stop();
    };
  }, [connection]);

  return <Lobby />;
}

export default PlayPage;
