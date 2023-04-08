import { Button, Toast, ToastContainer } from 'react-bootstrap';
import { EnvelopeOpenFill, CheckLg } from 'react-bootstrap-icons';
import { useSignalR } from '../../contexts/SignalRContext';
import { useUser } from '../../contexts/UserContext';

const ChallengeReceiver = ({ challenge, setChallenge }) => {
  const { connection } = useSignalR();
  const { user } = useUser();
  const challenger =
    challenge.whitePlayer.id === user.id
      ? { ...challenge.blackPlayer, color: 'black' }
      : { ...challenge.whitePlayer, color: 'white' };

  const handleAcceptChallenge = () => {
    setChallenge(null);
    connection.invoke('AcceptChallenge');
  };

  const handleRejectChallenge = () => {
    setChallenge(null);
    connection.invoke('RejectChallenge');
  };

  return (
    <ToastContainer position="bottom-end" className="p-3">
      <Toast onClose={handleRejectChallenge} className="challenge-toast">
        <Toast.Header closeButton={true}>
          <strong className="me-auto">
            <EnvelopeOpenFill size={20} className="me-2" />
            You have been challenged!
          </strong>
        </Toast.Header>
        <Toast.Body>
          <p>
            <strong>{challenger.username}</strong> has challenged you to a game
            of chess!
          </p>

          <p>
            Opponent's color: <strong>{challenger.color}</strong>
          </p>

          <p>Do you accept the challenge?</p>

          <div className="mt-2 pt-2 text-end border-top">
            <Button
              size="sm"
              variant="primary"
              block="true"
              onClick={handleAcceptChallenge}
            >
              <CheckLg size={20} className="me-1" />
              Accept
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ChallengeReceiver;
