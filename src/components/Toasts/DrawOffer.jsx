import { Button, Toast, ToastContainer } from 'react-bootstrap';
import { useSignalR } from '../../contexts/SignalRContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandshake,
  faCheck,
  faClose,
} from '@fortawesome/free-solid-svg-icons';

const DrawOffer = ({ username, setShowDrawOffer }) => {
  const { connection } = useSignalR();
  const handleAcceptOffer = () => {
    setShowDrawOffer(false);
    connection.invoke('AcceptDraw');
  };

  const handleRejectOffer = () => {
    setShowDrawOffer(false);
    connection.invoke('RejectDraw');
  };

  return (
    <ToastContainer position="middle-center">
      <Toast>
        <Toast.Header closeButton={false}>
          <FontAwesomeIcon icon={faHandshake} style={{ fontSize: 19 }} />
          <strong className="ms-1">Draw Offer</strong>
        </Toast.Header>
        <Toast.Body>
          {`${username} offered a draw. Do you accept?`}
          <div className="mt-2 pt-2 text-end border-top">
            <Button
              variant="success"
              size="sm"
              block="true"
              onClick={handleAcceptOffer}
            >
              <FontAwesomeIcon icon={faCheck} />
              <span> Accept</span>
            </Button>{' '}
            <Button
              variant="danger"
              size="sm"
              block="true"
              onClick={handleRejectOffer}
            >
              <FontAwesomeIcon icon={faClose} />
              <span> Reject</span>
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default DrawOffer;
