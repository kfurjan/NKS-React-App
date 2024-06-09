import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaThLarge, FaList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

class HomePage extends Component {
  state = {
    viewMode: "grid", // Default view mode is grid
  };

  setViewMode = (mode) => {
    this.setState({ viewMode: mode });
  };

  render() {
    const { viewMode } = this.state;

    return (
      <div className="homepage">
        <Container className="features-section mt-5">
          <ButtonGroup className="mb-4">
            <Button
              variant={viewMode === "grid" ? "primary" : "outline-primary"}
              onClick={() => this.setViewMode("grid")}
            >
              <FaThLarge />
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "outline-primary"}
              onClick={() => this.setViewMode("list")}
            >
              <FaList />
            </Button>
          </ButtonGroup>
          {viewMode === "grid" ? (
            <Row className="justify-content-center">
              <Col md={4} className="mb-4">
                <Card className="feature-card" as={Link} to="/login">
                  <Card.Body>
                    <Card.Title>Login</Card.Title>
                    <Card.Text>Access your account by logging in.</Card.Text>
                    <Button variant="primary">Login</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="feature-card" as={Link} to="/register">
                  <Card.Body>
                    <Card.Title>Register</Card.Title>
                    <Card.Text>Create a new account by registering.</Card.Text>
                    <Button variant="primary">Register</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-4">
                <Card className="feature-card" as={Link} to="/customers">
                  <Card.Body>
                    <Card.Title>Customers</Card.Title>
                    <Card.Text>View and manage customers.</Card.Text>
                    <Button variant="primary">Customers</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <div className="list-view">
              <Card className="feature-card mb-4" as={Link} to="/login">
                <Card.Body>
                  <Card.Title>Login</Card.Title>
                  <Card.Text>Access your account by logging in.</Card.Text>
                  <Button variant="primary">Login</Button>
                </Card.Body>
              </Card>
              <Card className="feature-card mb-4" as={Link} to="/register">
                <Card.Body>
                  <Card.Title>Register</Card.Title>
                  <Card.Text>Create a new account by registering.</Card.Text>
                  <Button variant="primary">Register</Button>
                </Card.Body>
              </Card>
              <Card className="feature-card mb-4" as={Link} to="/customers">
                <Card.Body>
                  <Card.Title>Customers</Card.Title>
                  <Card.Text>View and manage customers.</Card.Text>
                  <Button variant="primary">Customers</Button>
                </Card.Body>
              </Card>
            </div>
          )}
        </Container>
      </div>
    );
  }
}

export default HomePage;
