import Board from '../components/Board';
import { useEffect, useState } from 'react';
import { useSignalR } from '../contexts/SignalRContext';
import { useUser } from '../contexts/UserContext';
import '../styles/Global.css';

function GamePage() {
  const { connection } = useSignalR();
  const { user, setUser } = useUser();
  const [opponent, setOpponent] = useState();
  const [pgn, setPgn] = useState();
  const [oppConnStatus, setOppConnStatus] = useState();

  useEffect(() => {
    if (connection.state === 'Disconnected') {
      connection.start();
    }

    connection.on('SetGame', (pgn, whitePlayer, blackPlayer) => {
      setPgn(pgn);
      if (whitePlayer.id === user.id) {
        setUser(user => ({ ...user, color: 'white' }));
        blackPlayer.color = 'black';
        setOpponent(blackPlayer);
      } else {
        setUser(user => ({ ...user, color: 'black' }));
        whitePlayer.color = 'white';
        setOpponent(whitePlayer);
      }
      setOppConnStatus(true);
    });

    connection.on('OpponentConnected', () => setOppConnStatus(true));
    connection.on('OpponentDisconnected', () => setOppConnStatus(false));

    return () => {
      connection.stop();
      connection.off('SetGame');
      connection.off('OpponentConnected');
      connection.off('OpponentDisconnected');
    };
  }, [connection]);

  return (
    <div className="d-flex justify-content-center align-items-center">
      {opponent && (
        <Board opponent={opponent} pgn={pgn} oppConnStatus={oppConnStatus} />
      )}
    </div>
  );
}

export default GamePage;
