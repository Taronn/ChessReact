import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chessboard2 } from '@chrisoakman/chessboard2/dist/chessboard2.min.mjs';
import '@chrisoakman/chessboard2/dist/chessboard2.min.css';
import { Chess } from 'chess.js';
import { useSignalR } from '../contexts/SignalRContext';
import { useUser } from '../contexts/UserContext';
import { ToastContainer, toast, Zoom, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Board.css';
import PlayerInfo from './PlayerInfo';
import DrawOffer from './Toasts/DrawOffer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshakeSlash } from '@fortawesome/free-solid-svg-icons';

function Board({ opponent, pgn, oppConnStatus }) {
  const { connection } = useSignalR();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [showDrawOffer, setShowDrawOffer] = useState(false);
  const [chess, setChess] = useState({ game: new Chess() });

  let board;
  let pendingMove = null;

  const resultToastConfig = {
    position: 'top-center',
    icon: false,
    transition: Zoom,
    closeButton: false,
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    hideProgressBar: false,
    draggable: false,
    progress: undefined,
    theme: 'colored',
    className: 'text-center',
    onClose: () => {
      setUser(user => ({
        ...user,
        gameId: '00000000-0000-0000-0000-000000000000',
      }));
      connection.stop().then(() => navigate('/play'));
    },
  };

  useEffect(() => {
    const config = {
      position: chess.game.fen(),
      orientation: user.color,
      touchMove: true,
      appearSpeed: 'slow',
      moveSpeed: 'slow',
      snapbackSpeed: 'slow',
      snapSpeed: 'slow',
      trashSpeed: 'slow',
      onMousedownSquare,
      onTouchSquare,
    };
    if (pgn) {
      chess.game.loadPgn(pgn);
      config.position = chess.game.fen();
      setChess({ ...chess });
    }
    board = Chessboard2('chessboard', config);
  }, []);

  useEffect(() => {
    connection.on('MakeMove', (from, to) => {
      board.clearArrows();
      board.addArrow({
        color: 'orange',
        start: from,
        end: to,
        opacity: 50,
        size: 'small',
      });
      chess.game.move({ from: from, to: to });
      board.position(chess.game.fen());
      setChess({ ...chess });
    });

    connection.on('InvalidMove', () => {
      chess.game.undo();
      board.position(chess.game.fen());
      setChess({ ...chess });
    });

    connection.on('Win', reason => {
      toast.success(`You Won! by ${reason}`, resultToastConfig);
    });

    connection.on('Lose', reason => {
      toast.error(`You Lose! by ${reason}`, resultToastConfig);
    });

    connection.on('Draw', reason => {
      toast.info(`Game Draw! by ${reason}`, resultToastConfig);
    });

    connection.on('DrawOfferReceived', () => setShowDrawOffer(true));

    connection.on(
      'DrawOfferRejected',
      () => toast.warn('Your draw offer has been rejected'),
      {
        position: 'top-right',
        icon: <FontAwesomeIcon icon={faHandshakeSlash} />,
        transition: Slide,
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      }
    );

    return () => {
      connection.off('MakeMove');
      connection.off('Win');
      connection.off('Lose');
      connection.off('Draw');
      connection.off('DrawOfferRejected');
      connection.off('DrawOfferReceived');
    };
  }, [connection]);

  const onTouchSquare = (square, piece, boardInfo) =>
    onMousedownSquare({ square, piece });

  function onMousedownSquare({ square, piece }) {
    console.log('touch');
    board.clearCircles();

    // do not pick up pieces if the game is over
    if (chess.game.isGameOver()) return false;

    if (user.color[0] !== chess.game.turn()) {
      return false;
    }

    // get list of possible moves for this square
    const legalMoves = chess.game.moves({
      square,
      verbose: true,
    });

    legalMoves.forEach(move => {
      board.addCircle(move.to);
    });
    if (pendingMove && pendingMove === square) {
      board.clearCircles();
    }

    if (pendingMove && (!piece || piece[0] !== chess.game.turn())) {
      let move;

      try {
        move = chess.game.move({
          from: pendingMove,
          to: square,
          promotion: 'q', // always promote to a queen
        });
      } catch {
        move = null;
      }

      pendingMove = null;

      if (move) {
        connection.invoke('MakeMove', move.from, move.to);
        setChess({ ...chess });
        board.clearArrows();
        board.position(chess.game.fen());
      }
    } else if (piece && square !== pendingMove) {
      pendingMove = square;
    } else {
      pendingMove = null;
    }
  }

  return (
    <div className="game mt-3 shadow-lg">
      <PlayerInfo player={opponent} chess={chess} connStatus={oppConnStatus} />
      <div id="chessboard"></div>
      <PlayerInfo
        player={user}
        chess={chess}
        setShowDrawOffer={setShowDrawOffer}
      />
      {showDrawOffer && (
        <DrawOffer
          username={opponent.username}
          setShowDrawOffer={setShowDrawOffer}
        />
      )}
      <>
        <ToastContainer />
      </>
    </div>
  );
}

export default Board;
