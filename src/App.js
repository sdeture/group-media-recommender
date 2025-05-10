import React, { useState, useEffect } from 'react';
import './index.css'; // Ensure index.css is loaded

import UserForm from './components/UserForm';
import GroupPreferences from './components/GroupPreferences';
import Recommendations from './components/Recommendations';
import HeroSection from './components/HeroSection'; // Import HeroSection
import { getRecommendations } from './services/api';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [users, setUsers] = useState([{ id: uuidv4(), data: { name: '', spotifyTracks: '', youtubeHistory: '', netflixHistory: '', otherMedia: '' } }]);
  const [groupPreferences, setGroupPreferences] = useState({ commonInterests: '', mediaToAvoid: '', vibe: 'any' });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddUser = () => {
    if (users.length < 5) {
      setUsers([...users, { id: uuidv4(), data: { name: '', spotifyTracks: '', youtubeHistory: '', netflixHistory: '', otherMedia: '' } }]);
    }
  };

  const handleRemoveUser = (userIdToRemove) => {
    if (users.length > 1) {
      setUsers(users.filter(user => user.id !== userIdToRemove));
    }
  };

  const handleUserDataChange = (userId, field, value) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, data: { ...user.data, [field]: value } } : user
    ));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setRecommendations([]);
    try {
      // Get users data and pass as separate parameters to match API function signature
      const usersData = users.map(u => u.data);
      const data = await getRecommendations(usersData, groupPreferences);
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-black text-white font-poppins">
      <HeroSection /> {/* Add HeroSection at the top */}
      
      {/* Wrap existing content in a new Container with id and className */}
      <div id="info-stack-container" className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-4 pb-10">
        {/* Group Members Introduction Card */}
        <div className="w-full bg-neutral-800 rounded-xl neon-glow border border-neon-blue mb-8 p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Add Group Members</h3>
          <p className="text-white mb-0">Add between 1-5 friends and their media preferences.</p>
        </div>

        {users.map((user, index) => (
          <UserForm
            key={user.id}
            userId={user.id}
            userIndex={index}
            initialUserData={user.data}
            onUserDataChange={handleUserDataChange}
            onRemoveUser={handleRemoveUser}
            isFirstUser={index === 0}
          />
        ))}

        {users.length < 5 && (
          <div className="text-center my-12">
            <button
              onClick={handleAddUser}
              className="py-2 px-6 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue text-white rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-75 transition-all ease-in-out duration-150"
            >
              Add Another User
            </button>
          </div>
        )}

        <GroupPreferences preferences={groupPreferences} setPreferences={setGroupPreferences} />

        <div className="text-center my-16">
          <button
            onClick={handleSubmit}
            disabled={loading} // Removed name validation to allow clicking even if fields are empty
            className="py-3 px-8 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink text-white text-lg rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all ease-in-out duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-neon-blue mr-3"></div>
                Getting Recs...
              </div>
            ) : (
              'Get Group Recommendations'
            )}
          </button>
        </div>
        
        {error && 
          <div className="w-full max-w-2xl mx-auto mt-6 p-4 bg-red-900/50 border border-red-700 text-white rounded-lg neon-glow shadow-lg">
            {error}
          </div>
        }

        <Recommendations recommendations={recommendations} loading={loading} />
      </div>
    </div>
  );
}

export default App;
