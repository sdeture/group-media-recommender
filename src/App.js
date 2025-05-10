import React, { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import UserForm from './components/UserForm';
import GroupPreferences from './components/GroupPreferences';
import Recommendations from './components/Recommendations';
import { getRecommendations } from './services/api';

function App() {
  const [users, setUsers] = useState([{ id: 0, data: {} }]);
  const [groupPreferences, setGroupPreferences] = useState({
    mediaInterests: '',
    mediaAvoid: '',
    moodTheme: '',
    additionalComments: ''
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserDataChange = (userId, data) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, data } : user
      )
    );
  };

  const addUser = () => {
    if (users.length < 5) {
      const newUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 0;
      setUsers([...users, { id: newUserId, data: {} }]);
    }
  };

  const removeUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // For demo purposes, we'll generate mock data if the backend is not available
      // In a real app, this would call the API
      const usersData = users.map(user => user.data);
      
      try {
        const result = await getRecommendations(usersData, groupPreferences);
        setRecommendations(result.recommendations);
      } catch (apiError) {
        console.error('API Error, using mock data instead:', apiError);
        
        // Mock data for demonstration purposes
        setTimeout(() => {
          setRecommendations([
            {
              title: 'The Twilight Zone (Classic Series)',
              description: 'A mix of sci-fi, fantasy, and horror that appeals to diverse tastes while avoiding explicit content.',
              type: 'TV Series'
            },
            {
              title: "Chef's Table",
              description: "A visually stunning documentary series about culinary arts that can appeal to both food enthusiasts and those who enjoy beautiful cinematography.",
              type: "Documentary Series"
            },
            {
              title: 'Spider-Man: Into the Spider-Verse',
              description: 'An animated superhero film with universal appeal, combining action, humor, and heart.',
              type: 'Animated Film'
            },
            {
              title: 'Tiny Desk Concerts',
              description: 'NPR\'s music series featuring intimate performances from diverse artists across genres.',
              type: 'Music Series'
            },
            {
              title: 'Crash Course (YouTube)',
              description: 'Educational content covering various subjects in an entertaining and accessible way.',
              type: 'Educational Series'
            }
          ]);
        }, 2000);
      }
    } catch (error) {
      setError('An error occurred while generating recommendations. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Group Media Recommender</h1>
          <p className="text-center lead">
            Enter information about each user's media preferences to get personalized group recommendations.
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <Card.Header>
              <h3>User Information</h3>
              <p className="mb-0">Add between 2-5 users and their media preferences</p>
            </Card.Header>
            <Card.Body>
              {users.map(user => (
                <UserForm
                  key={user.id}
                  userId={user.id}
                  onUserDataChange={handleUserDataChange}
                  onRemoveUser={removeUser}
                />
              ))}
              
              {users.length < 5 && (
                <Button 
                  variant="primary" 
                  onClick={addUser} 
                  className="mb-3"
                >
                  Add Another User
                </Button>
              )}
            </Card.Body>
          </Card>

          <GroupPreferences 
            preferences={groupPreferences} 
            setPreferences={setGroupPreferences} 
          />

          <div className="d-grid gap-2 mb-4">
            <Button 
              variant="success" 
              size="lg" 
              onClick={handleSubmit}
              disabled={loading || users.length < 1}
            >
              {loading ? 'Generating...' : 'Get Recommendations'}
            </Button>
          </div>
        </Col>

        <Col md={5}>
          <Recommendations 
            recommendations={recommendations}
            loading={loading}
            error={error}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default App;
