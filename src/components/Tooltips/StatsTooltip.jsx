import { OverlayTrigger, Tooltip, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faHandshake,
  faChess,
  faPercentage,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

const StatsTooltip = ({
  player,
  placement,
  trigger = ['click', 'hover'],
  children,
}) => {
  const tooltip = (
    <Tooltip>
      <Row>
        <Col>
          <FontAwesomeIcon icon={faStar} className="me-1" fixedWidth />
          {player.stats.rating}
        </Col>
      </Row>
      <hr className="my-1" />
      <Row>
        <Col>
          <FontAwesomeIcon icon={faChess} className="me-1" fixedWidth />
          {player.stats.gamesPlayed}
        </Col>

        <Col>
          <FontAwesomeIcon icon={faPercentage} className="me-1" fixedWidth />
          {player.stats.winPercentage}%
        </Col>
      </Row>
      <hr className="my-1" />
      <Row>
        <Col className="d-flex">
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="me-1 mt-1"
            fixedWidth
          />
          <span className="text-nowrap">{player.stats.wins}</span>
        </Col>

        <Col className="d-flex">
          <FontAwesomeIcon
            icon={faHandshake}
            className="me-1 mt-1"
            fixedWidth
          />
          <span className="text-nowrap">{player.stats.draws}</span>
        </Col>

        <Col className="d-flex">
          <FontAwesomeIcon
            icon={faTimesCircle}
            className="me-1 mt-1"
            fixedWidth
          />
          <span className="text-nowrap">{player.stats.losses}</span>
        </Col>
      </Row>
    </Tooltip>
  );

  return (
    <OverlayTrigger
      trigger={trigger}
      placement={placement}
      overlay={tooltip}
      rootClose={true}
    >
      {children}
    </OverlayTrigger>
  );
};

export default StatsTooltip;
