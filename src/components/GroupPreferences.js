import React from 'react';
import { Form, Card } from 'react-bootstrap';

const GroupPreferences = ({ preferences, setPreferences }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h4>Group Preferences</h4>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>What types of media are you interested in watching/consuming together?</Form.Label>
            <Form.Control
              as="textarea"
              name="mediaInterests"
              value={preferences.mediaInterests}
              onChange={handleChange}
              placeholder="E.g., action movies, comedy shows, documentaries about nature..."
              rows={3}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>What types of media do you want to avoid?</Form.Label>
            <Form.Control
              as="textarea"
              name="mediaAvoid"
              value={preferences.mediaAvoid}
              onChange={handleChange}
              placeholder="E.g., horror movies, political documentaries..."
              rows={3}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Any specific mood or theme you're looking for?</Form.Label>
            <Form.Control
              as="textarea"
              name="moodTheme"
              value={preferences.moodTheme}
              onChange={handleChange}
              placeholder="E.g., uplifting, educational, nostalgic..."
              rows={2}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Additional comments</Form.Label>
            <Form.Control
              as="textarea"
              name="additionalComments"
              value={preferences.additionalComments}
              onChange={handleChange}
              placeholder="Any other preferences or requirements..."
              rows={2}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default GroupPreferences;
