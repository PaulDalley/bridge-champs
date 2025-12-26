import React from 'react';
import { Card, Col, Row } from 'react-materialize';
import './Contact.css';

const Contact = () => {
  return (
    <div className="Contact-container">
      <Row>
        <Col s={12} m={10} l={8} offset="m1 l2">
          <Card className="Contact-card">
            <h2 className="Contact-title">Contact</h2>
            
            <div className="Contact-content">
              <p>
                If you have any questions, issues, or feedback about Bridge Champions, 
                please feel free to reach out:
              </p>

              <div className="Contact-email-section">
                <h4>Email</h4>
                <a href="mailto:paul.dalley@hotmail.com" className="Contact-email">
                  paul.dalley@hotmail.com
                </a>
              </div>

              <p className="Contact-response-time">
                We typically respond within 24-48 hours.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Contact;
