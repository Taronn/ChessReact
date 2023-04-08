import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  const { isAuth } = useAuth();
  const { user } = useUser();
  return (
    <Container>
      <Row className="my-5">
        <Col>
          {isAuth ? (
            <h1>Welcome back, {user.username}!</h1>
          ) : (
            <h1>Welcome to Online Chess!</h1>
          )}
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <p>Play chess against other players online.</p>
          {isAuth ? (
            <p>You're logged in and ready to play.</p>
          ) : (
            <p>Sign up or log in to get started.</p>
          )}
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <Link to="/play">
            <Button variant="primary" size="lg">
              Play Now
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
