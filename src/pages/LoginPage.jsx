import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import 'parsleyjs/dist/parsley';
import '../styles/LoginPage.css';
import ParsleyErrors from '../components/Forms/ParsleyErrors';
import authService from '../services/authService';
import { useUser } from '../contexts/UserContext';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { setUser } = useUser();
  const { setIsAuth } = useAuth();
  ParsleyErrors('login-form');
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    const form = document.querySelector('.login-form');

    const formData = new FormData(form);
    const loginData = {};

    for (const [key, value] of formData.entries()) {
      loginData[key] = value;
    }
    loginData.RememberMe = loginData.RememberMe === 'true' ? true : false;

    authService
      .login(loginData)
      .then(() => {
        authService.getUser().then(response => {
          setUser(response.data);
          setIsAuth(true);
          navigate('/play');
        });
      })
      .catch(err => {
        setErrorMessage(err.response.data);
        setShowError(true);
      });
  };

  function handleCloseAlert() {
    setShowError(false);
  }

  return (
    <div className="form-wrapper">
      <Form
        className="login-form shadow-lg rounded"
        name="login"
        data-parsley-focus="first"
      >
        <p className="text-center h1 fw-bold mb-4 mx-1 mx-auto mt-3">Sign In</p>
        {showError && (
          <Alert variant="danger" onClose={handleCloseAlert} dismissible>
            {errorMessage}
          </Alert>
        )}

        <Form.Group>
          <Form.Control
            size="sm"
            className="shadow-sm"
            type="email"
            name="Email"
            placeholder="Email"
            required
            data-parsley-required-message="Email address is required"
          />
        </Form.Group>
        <Form.Group className="mt-3">
          <Form.Control
            size="sm"
            className="mt-3 shadow-sm"
            type="password"
            name="Password"
            placeholder="Password"
            required
            data-parsley-required-message="Password is required"
            data-parsley-minlength="8"
            data-parsley-minlength-message="Password must be at least 8 characters"
            data-parsley-maxlength="32"
            data-parsley-maxlength-message="Password is too long. It should have 32 characters or fewer."
          />
        </Form.Group>
        <Form.Group>
          <Form.Check
            size="sm"
            className="mt-3"
            type="checkbox"
            label="Remember me"
            id="remember"
            name="RememberMe"
            value="true"
          />
        </Form.Group>
        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="primary"
            size="sm"
            type="submit"
            onClick={handleSubmit}
          >
            Log In
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
