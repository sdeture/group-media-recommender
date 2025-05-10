import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const UserForm = ({ userId, onUserDataChange, onRemoveUser }) => {
  const [userData, setUserData] = useState({
    name: '',
    spotifyTracks: '',
    youtubeHistory: '',
    netflixHistory: '',
    otherMedia: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...userData, [name]: value };
    setUserData(updatedData);
    onUserDataChange(userId, updatedData);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h4>User {userId + 1}</h4>
          {userId > 0 && (
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => onRemoveUser(userId)}
            >
              Remove
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Top Spotify Tracks</Form.Label>
            <Form.Control
              as="textarea"
              name="spotifyTracks"
              value={userData.spotifyTracks}
              onChange={handleChange}
              placeholder="Enter your most listened to Spotify tracks"
              rows={2}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Recent YouTube History</Form.Label>
            <Form.Control
              as="textarea"
              name="youtubeHistory"
              value={userData.youtubeHistory}
              onChange={handleChange}
              placeholder="Enter your recent YouTube video history"
              rows={2}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Recent Netflix History</Form.Label>
            <Form.Control
              as="textarea"
              name="netflixHistory"
              value={userData.netflixHistory}
              onChange={handleChange}
              placeholder="Enter your recent Netflix watch history"
              rows={2}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Other Media Interests</Form.Label>
            <Form.Control
              as="textarea"
              name="otherMedia"
              value={userData.otherMedia}
              onChange={handleChange}
              placeholder="Enter any other media interests or preferences"
              rows={2}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserForm;
