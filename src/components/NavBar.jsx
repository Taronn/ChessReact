import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Person,
  BoxArrowInRight,
  PersonCircle,
  BoxArrowInLeft,
} from 'react-bootstrap-icons';
import authService from '../services/authService';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';
import StatsTooltip from './Tooltips/StatsTooltip';

function NonAuthButtons() {
  return (
    <Nav>
      <Nav.Link as={NavLink} to="/register">
        <Button variant="primary" size="sm">
          <Person size={17} className="me-1" />
          <span>Sign Up</span>
        </Button>
      </Nav.Link>
      <Nav.Link as={NavLink} to="/login">
        <Button variant="secondary" size="sm">
          <BoxArrowInRight size={17} className="me-1" />
          <span>Login</span>
        </Button>
      </Nav.Link>
    </Nav>
  );
}

function AuthButtons() {
  const { user, setUser } = useUser();
  const { setIsAuth } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    authService.logout().then(response => {
      setUser(response.data);
      setIsAuth(false);
      navigate('/login');
    });
  };
  return (
    <Nav>
      <Nav.Link as={NavLink}>
        <StatsTooltip player={user} placement={'bottom'} trigger={['click']}>
          <Button variant="primary" size="sm">
            <PersonCircle size={17} className="me-1" />
            <span>
              {' '}
              {user.username.length > 10
                ? user.username.substring(0, 10) + '...'
                : user.username}
            </span>
          </Button>
        </StatsTooltip>
      </Nav.Link>
      <Nav.Link as={NavLink}>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          <BoxArrowInLeft size={17} className="me-1" />

          <span>Logout</span>
        </Button>
      </Nav.Link>
    </Nav>
  );
}

function NavBar() {
  const { isAuth } = useAuth();
  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/">
          <img src="assets/icons/logo-white.svg" alt="" height="37px" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/play">
              Play
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
          </Nav>
          {isAuth ? <AuthButtons /> : <NonAuthButtons />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
