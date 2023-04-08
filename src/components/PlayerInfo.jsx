import React from 'react';
import { useEffect, useState } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useUser } from '../contexts/UserContext';
import { useSignalR } from '../contexts/SignalRContext';
import {
  faChessKnight,
  faChessQueen,
  faChessPawn,
  faChessRook,
  faChessBishop,
  faEllipsisVertical,
  faFlag,
  faHandshake,
  faChessBoard,
  faChess,
} from '@fortawesome/free-solid-svg-icons';
import StatsTooltip from './Tooltips/StatsTooltip';

const PlayerInfo = ({ player, chess, setShowDrawOffer, connStatus = true }) => {
  const { user } = useUser();
  const { connection } = useSignalR();
  const [capturedPieces, setCapturedPieces] = useState();
  const [isDrawOffered, setIsDrawOffered] = useState(false);

  const getCapturedPieces = () => {
    const captured = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    const color = player.color[0] === 'w' ? 'b' : 'w';

    for (const move of chess.game.history({ verbose: true })) {
      if (move.hasOwnProperty('captured') && move.color !== color) {
        captured[move.captured]++;
      }
    }

    return captured;
  };

  useEffect(() => {
    setIsDrawOffered(false);
    if (
      chess.game.history({ verbose: true }).at(-1)?.hasOwnProperty('captured')
    ) {
      setCapturedPieces(getCapturedPieces());
    }
  }, [chess]);

  const getIconByPieceType = pieceType => {
    switch (pieceType) {
      case 'p':
        return faChessPawn;
      case 'n':
        return faChessKnight;
      case 'b':
        return faChessBishop;
      case 'r':
        return faChessRook;
      case 'q':
        return faChessQueen;
      default:
        return null;
    }
  };

  const handleOfferDraw = () => {
    setIsDrawOffered(true);
    connection.invoke('OfferDraw');
  };

  const handleResign = () => {
    connection.invoke('Resign');
  };

  return (
    <Container
      fluid
      className={
        'd-flex align-items-center p-0 bg-dark pt-1 ' +
        (player.id === user.id ? 'rounded-bottom' : 'rounded-top')
      }
    >
      <StatsTooltip
        player={player}
        placement={player.id === user.id ? 'top' : 'bottom'}
        trigger={['click']}
      >
        <h4
          className={
            'p-1 m-2 rounded position-relative ' +
            (chess.game.turn() === player.color[0]
              ? 'text-bg-light'
              : 'text-bg-dark')
          }
          style={{ cursor: 'pointer' }}
        >
          {player.username}
          <span
            className="position-absolute translate-middle badge bg-primary "
            style={{ fontSize: '0.6rem' }}
          >
            {player.stats.rating}
          </span>
        </h4>
      </StatsTooltip>

      <div className="ms-3">
        {capturedPieces &&
          Object.entries(capturedPieces).map(([pieceType, count]) =>
            Array.from({ length: count }, (_, i) => (
              <FontAwesomeIcon
                key={`${pieceType}-${i}`}
                icon={getIconByPieceType(pieceType)}
                style={{ color: '#ffffff' }}
              />
            ))
          )}
      </div>
      {player.id === user.id && (
        <Dropdown drop="up" className="ms-auto">
          <Dropdown.Toggle variant="transparent">
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              style={{ color: '#ffffff' }}
            />
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-dark">
            <Dropdown.Item
              onClick={handleOfferDraw}
              disabled={
                chess.game.turn() === player.color[0] && !isDrawOffered
                  ? false
                  : true
              }
            >
              <FontAwesomeIcon icon={faHandshake} fixedWidth /> Draw
            </Dropdown.Item>
            <Dropdown.Item onClick={handleResign}>
              <FontAwesomeIcon icon={faFlag} fixedWidth /> Resign
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item
              onClick={() => navigator.clipboard.writeText(chess.game.fen())}
            >
              <FontAwesomeIcon icon={faChessBoard} fixedWidth /> FEN
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => navigator.clipboard.writeText(chess.game.pgn())}
            >
              <FontAwesomeIcon icon={faChess} fixedWidth /> PGN
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </Container>
  );
};

export default PlayerInfo;
