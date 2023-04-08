import { useState } from 'react';
import {
  Button,
  Toast,
  ToastContainer,
  ToggleButtonGroup,
  ToggleButton,
} from 'react-bootstrap';
import { EnvelopePlusFill, Send } from 'react-bootstrap-icons';
import { useSignalR } from '../../contexts/SignalRContext';

const ChallengeSender = ({ selectedPlayer, setSelectedPlayer }) => {
  const { connection } = useSignalR();
  const [selectedColor, setSelectedColor] = useState(null);

  const handleSendChallenge = () => {
    connection.invoke('ChallengePlayer', selectedPlayer.id, selectedColor);
    setSelectedPlayer(null);
  };

  return (
    <ToastContainer position="middle-center">
      <Toast onClose={() => setSelectedPlayer(null)}>
        <Toast.Header closeButton className="text-end">
          <strong className="me-auto">
            <EnvelopePlusFill size={20} className="me-2" />
            Challenge {selectedPlayer?.username}
          </strong>
        </Toast.Header>
        <Toast.Body>
          Choose your color:
          <ToggleButtonGroup
            type="radio"
            size="sm"
            className="ms-2"
            name="color-select"
            value={selectedColor}
            onChange={setSelectedColor}
          >
            <ToggleButton id="black-btn" variant="light" value={'white'}>
              White
            </ToggleButton>
            <ToggleButton id="white-btn" variant="dark" value={'black'}>
              Black
            </ToggleButton>
          </ToggleButtonGroup>
          <div className="mt-2 pt-2 text-end border-top">
            <Button
              variant="primary"
              size="sm"
              className="ms-2"
              onClick={handleSendChallenge}
              disabled={!selectedColor}
            >
              <Send size={16} className="me-2" />
              Send
            </Button>
          </div>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ChallengeSender;
