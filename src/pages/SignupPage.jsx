import { useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import '../styles/SignupPage.css';
import { useState } from 'react';
import 'parsleyjs/dist/parsley';
import { registerUser } from '../services/registrationService';
import ParsleyErrors from '../components/Forms/ParsleyErrors';

function SignupPage() {
  ParsleyErrors('signup-form');
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    const form = document.querySelector('.signup-form');

    const formData = new FormData(form);
    const registrationData = {};

    for (const [key, value] of formData.entries()) {
      registrationData[key] = value;
    }

    registerUser(registrationData)
      .then(() => navigate('/login'))
      .catch(err => {
        setErrorMessage(err.response.data);
        setShowError(true);
      });
  };

  function handleCloseAlert() {
    setShowError(false);
  }

  return (
    <div className="form-wrapper ">
      <Form
        className="signup-form shadow-lg rounded"
        name="registration"
        data-parsley-focus="first"
      >
        <Form.Group>
          <p className="text-center h1 fw-bold mb-4 mx-1 mx-auto mt-3">
            Sign Up
          </p>
          {showError && (
            <Alert variant="danger" onClose={handleCloseAlert} dismissible>
              {errorMessage}
            </Alert>
          )}

          <Form.Control
            size="sm"
            className="shadow-sm"
            type="text"
            name="Username"
            placeholder="Username"
            required
            data-parsley-required-message="Username is required"
            data-parsley-minlength="6"
            data-parsley-minlength-message="Username must be at least 6 characters"
            data-parsley-maxlength="15"
            data-parsley-maxlength-message="Username is too long. It should have 15 characters or fewer."
            data-parsley-type="alphanum"
          />
        </Form.Group>

        <Row>
          <Col sm={4} className="mt-3">
            <Form.Control
              size="sm"
              className="shadow-sm"
              type="text"
              name="FirstName"
              placeholder="First name"
              required
              data-parsley-required-message="First name is required"
              data-parsley-type="alphanum"
            />
          </Col>
          <Col sm={8} className="mt-3">
            <Form.Control
              size="sm"
              className="shadow-sm"
              type="text"
              name="LastName"
              placeholder="Last name"
              required
              data-parsley-required-message="Last name is required"
              data-parsley-type="alphanum"
            />
          </Col>
        </Row>

        <Form.Group>
          <Form.Control
            size="sm"
            className="mt-3 shadow-sm"
            type="email"
            name="Email"
            placeholder="Email"
            required
            data-parsley-required-message="Email is required"
          />
        </Form.Group>

        <Form.Group>
          <Form.Control
            size="sm"
            className="mt-3 shadow-sm"
            type="password"
            name="Password"
            id="Password"
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
          <Form.Control
            size="sm"
            className="mt-3 shadow-sm"
            type="password"
            placeholder="Confirm password"
            name="PasswordConfirmation"
            required
            data-parsley-required-message="Confirm password is required"
            data-parsley-equalto="#Password"
            data-parsley-equalto-message="Passwords do not match"
          />
        </Form.Group>

        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="primary"
            type="submit"
            onClick={handleSubmit}
            size="sm"
          >
            Create Account
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default SignupPage;
