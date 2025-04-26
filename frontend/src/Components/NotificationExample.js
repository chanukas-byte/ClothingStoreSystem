import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

const NotificationExample = () => {
  const { success, error, info, warning } = useNotification();

  const handleShowSuccess = () => {
    success('Operation completed successfully!');
  };

  const handleShowError = () => {
    error('An error occurred. Please try again.');
  };

  const handleShowInfo = () => {
    info('Here is some information for you.');
  };

  const handleShowWarning = () => {
    warning('Please be careful with this action.');
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">Notification Examples</h1>
      <p className="text-center mb-5">
        This component demonstrates how to use our custom notification system.
        Click on the buttons below to see different types of notifications.
      </p>

      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h3 className="mb-4">Notification Types</h3>
              
              <div className="d-grid gap-3">
                <Button 
                  variant="success" 
                  size="lg" 
                  onClick={handleShowSuccess}
                  className="py-3"
                >
                  Show Success Notification
                </Button>
                
                <Button 
                  variant="danger" 
                  size="lg" 
                  onClick={handleShowError}
                  className="py-3"
                >
                  Show Error Notification
                </Button>
                
                <Button 
                  variant="info" 
                  size="lg" 
                  onClick={handleShowInfo}
                  className="py-3"
                >
                  Show Info Notification
                </Button>
                
                <Button 
                  variant="warning" 
                  size="lg" 
                  onClick={handleShowWarning}
                  className="py-3"
                >
                  Show Warning Notification
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NotificationExample; 