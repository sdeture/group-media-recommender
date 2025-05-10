import React from 'react';
import { Card, Spinner, Alert, ListGroup } from 'react-bootstrap';

const Recommendations = ({ recommendations, loading, error }) => {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h4>Group Recommendations</h4>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-2">Generating personalized recommendations...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">
            {error}
          </Alert>
        ) : recommendations.length > 0 ? (
          <>
            <p className="mb-3">Based on everyone's preferences and history, here are some recommendations for your group:</p>
            <ListGroup variant="flush">
              {recommendations.map((rec, index) => (
                <ListGroup.Item key={index} className="p-3">
                  <h5>{rec.title}</h5>
                  <p className="mb-1">{rec.description}</p>
                  {rec.type && <small className="text-muted">Type: {rec.type}</small>}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : (
          <Alert variant="info">
            Fill in user preferences and click "Get Recommendations" to receive personalized suggestions for your group.
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default Recommendations;
