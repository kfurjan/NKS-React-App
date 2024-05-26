import React, { Component } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

class HomePage extends Component {
  render() {
    return (
      <div className="homepage">
        <Container className="features-section mt-5">
          <Row className="justify-content-center">
            <Col md={4} className="mb-4">
              <Card className="feature-card">
                <Card.Body>
                  <Card.Title>Feature One</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet.
                  </Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card">
                <Card.Body>
                  <Card.Title>Feature Two</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet.
                  </Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card">
                <Card.Body>
                  <Card.Title>Feature Three</Card.Title>
                  <Card.Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque imperdiet.
                  </Card.Text>
                  <Button variant="primary">Learn More</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default HomePage;
