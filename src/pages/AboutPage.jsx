import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Github, Linkedin, Facebook, Instagram } from 'react-bootstrap-icons';

function AboutPage() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">About Us</h2>

          <p>
            If you have any questions or feedback, please don't hesitate to
            contact us using the links below or email us at{' '}
            <a href="mailto:info@chess.com">taronngabrielyan@gmail.com</a>.
          </p>
          <Row className="justify-content-center flex-wrap mt-4">
            <Col xs="auto" className="px-2 mb-3 mb-md-0 text-center">
              <Button
                variant="outline-primary"
                href="https://github.com/Taronn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={20} className="me-2" />
                GitHub
              </Button>
            </Col>
            <Col xs="auto" className="px-2 mb-3 mb-md-0 text-center">
              <Button
                variant="outline-primary"
                href="https://www.linkedin.com/in/taron-gabrielyan-621526254/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={20} className="me-2" />
                LinkedIn
              </Button>
            </Col>
            <Col xs="auto" className="px-2 mb-3 mb-md-0 text-center">
              <Button
                variant="outline-primary"
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={20} className="me-2" />
                Facebook
              </Button>
            </Col>
            <Col xs="auto" className="px-2 mb-3 mb-md-0 text-center">
              <Button
                variant="outline-primary"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={20} className="me-2" />
                Instagram
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;
