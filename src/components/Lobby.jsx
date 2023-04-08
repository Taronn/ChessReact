import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  ListGroup,
  Spinner,
  Button,
  Badge,
} from 'react-bootstrap';
import {
  PersonFillCheck,
  PlusCircleFill,
  EnvelopeXFill,
  EnvelopeExclamationFill,
} from 'react-bootstrap-icons';
import { useUser } from '../contexts/UserContext';
import { useSignalR } from '../contexts/SignalRContext';
import ChallengeReceiver from './Toasts/ChallengeReceiver';
import ChallengeSender from './Toasts/ChallengeSender';
import StatsTooltip from './Tooltips/StatsTooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Lobby.css';

const Lobby = () => {
  const { connection } = useSignalR();
  const { setUser } = useUser();
  const [playersList, setPlayersList] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const navigate = useNavigate();

  const errorToastConfig = {
    position: 'top-left',
    closeButton: false,
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    className: 'd-inline-block text-nowrap',
  };

  useEffect(() => {
    connection.on('GetPlayersList', playersList => setPlayersList(playersList));

    connection.on('PlayerJoined', player => {
      setPlayersList(playersList => [...playersList, player]);
    });

    connection.on('PlayerLeft', id =>
      setPlayersList(playersList => playersList.filter(p => p.id !== id))
    );

    connection.on('ChallengeReceived', newChallenge => {
      setChallenge(newChallenge);
    });

    connection.on('PlayerBusy', username => {
      toast.warn(`${username} is busy, please try again later!`, {
        position: 'top-left',
        icon: <EnvelopeExclamationFill size={20} />,
        closeButton: false,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        className: 'd-inline-block text-nowrap',
      });
    });

    connection.on('ChallengeRejected', username => {
      toast.info(`${username} rejected your challenge.`, {
        position: 'bottom-left',
        icon: <EnvelopeXFill size={20} />,
        closeButton: false,
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        className: 'd-inline-block text-nowrap',
      });
    });

    connection.on(
      'ChallengeAccepted',
      (gameId, challengerUsername, opponentUsername) => {
        toast.success(`${challengerUsername} VS. ${opponentUsername}`, {
          position: 'top-center',
          icon: false,
          closeButton: false,
          autoClose: 2000,
          closeOnClick: false,
          pauseOnHover: false,
          hideProgressBar: false,
          draggable: false,
          progress: undefined,
          theme: 'colored',
          className: 'd-inline-block text-nowrap text-center',
          onClose: () => {
            setUser(user => ({ ...user, gameId: gameId }));
            connection.stop().then(() => navigate('/game'));
          },
        });
      }
    );
    connection.on('ChallengeError', message => {
      toast.error(message, errorToastConfig);
    });

    connection.on('ChallengeExpired', message => {
      setChallenge(null);
      toast.error(message, errorToastConfig);
    });

    connection.on('GameStarted', (whitePlayer, blackPlayer) => {
      setPlayersList(playersList =>
        playersList.filter(
          p => p.id !== whitePlayer.id && p.id !== blackPlayer.id
        )
      );
    });

    return () => {
      connection.off('GetPlayersList');
      connection.off('PlayerJoined');
      connection.off('PlayerLeft');
      connection.off('PlayerBusy');
      connection.off('ChallengeReceived');
      connection.off('ChallengeRejected');
      connection.off('ChallengeAccepted');
      connection.off('ChallengeError');
      connection.off('ChallengeExpired');
      connection.off('GameStarted');
    };
  }, [connection]);

  return (
    <Container className="my-3">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center">Game Lobby</h2>
          <hr />
          {playersList.length === 0 ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Loading players list...</p>
            </div>
          ) : (
            <ListGroup className="Lobby">
              {playersList.map(player => (
                <ListGroup.Item key={player.id} className="bg-dark text-white">
                  <PersonFillCheck size={22} className="me-2" />
                  <StatsTooltip player={player} placement={'right'}>
                    <Button variant="dark" className="p-0">
                      <strong>{player.username}</strong>
                    </Button>
                  </StatsTooltip>

                  <Badge pill className="ms-1">
                    {player.stats.rating}
                  </Badge>
                  <Button
                    className="ms-2 float-end"
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    <PlusCircleFill size={20} className="me-2" />
                    Challenge
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      {selectedPlayer && (
        <ChallengeSender
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
        />
      )}
      {challenge && (
        <ChallengeReceiver challenge={challenge} setChallenge={setChallenge} />
      )}

      <>
        <ToastContainer />
      </>
    </Container>
  );
};

export default Lobby;
