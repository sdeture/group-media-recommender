import React, { useState } from 'react';

const UserForm = ({ userId, userIndex, initialUserData, onUserDataChange, onRemoveUser, isFirstUser }) => {
  const [userData, setUserData] = useState(initialUserData || {
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
    onUserDataChange(userId, name, value); // Pass field (name) and value separately
  };

  return (
    <div className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-xl neon-glow border border-neon-purple mb-12 shadow-xl overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-neon-purple/50">
        <h4 className="text-xl font-semibold text-white">User {userIndex + 1}</h4>
        {!isFirstUser && onRemoveUser && (
          <button 
            onClick={() => onRemoveUser(userId)}
            className="text-sm text-white hover:text-white border border-red-500 hover:border-red-400 rounded-md py-1 px-2 transition-colors duration-150"
          >
            Remove
          </button>
        )}
      </div>
      <div className="p-6 space-y-[4.375rem]">
        <form>
          <div>
            <label htmlFor={`name-${userId}`} className="block text-sm font-normal text-white py-4 mb-1">Name</label>
            <input
              type="text"
              id={`name-${userId}`}
              name="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter name"
              className="block w-full bg-neutral-800 border border-neutral-600 text-gray-300 placeholder-gray-500 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-neon-pink focus:border-neon-pink outline-none transition-all duration-150 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor={`spotifyTracks-${userId}`} className="block text-sm font-normal text-white py-4 mb-1">Top Spotify Tracks</label>
            <textarea
              id={`spotifyTracks-${userId}`}
              name="spotifyTracks"
              value={userData.spotifyTracks}
              onChange={handleChange}
              placeholder="Enter your most listened to Spotify tracks"
              rows={2}
              className="block w-full bg-neutral-800 border border-neutral-600 text-gray-300 placeholder-gray-500 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-neon-pink focus:border-neon-pink outline-none transition-all duration-150 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor={`youtubeHistory-${userId}`} className="block text-sm font-normal text-white py-4 mb-1">Recent YouTube History</label>
            <textarea
              id={`youtubeHistory-${userId}`}
              name="youtubeHistory"
              value={userData.youtubeHistory}
              onChange={handleChange}
              placeholder="Enter your recent YouTube video history"
              rows={2}
              className="block w-full bg-neutral-800 border border-neutral-600 text-gray-300 placeholder-gray-500 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-neon-pink focus:border-neon-pink outline-none transition-all duration-150 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor={`netflixHistory-${userId}`} className="block text-sm font-normal text-white py-4 mb-1">Recent Netflix History</label>
            <textarea
              id={`netflixHistory-${userId}`}
              name="netflixHistory"
              value={userData.netflixHistory}
              onChange={handleChange}
              placeholder="Enter your recent Netflix watch history"
              rows={2}
              className="block w-full bg-neutral-800 border border-neutral-600 text-gray-300 placeholder-gray-500 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-neon-pink focus:border-neon-pink outline-none transition-all duration-150 shadow-sm"
            />
          </div>

          <div>
            <label htmlFor={`otherMedia-${userId}`} className="block text-sm font-normal text-white py-4 mb-1">Other Media Interests</label>
            <textarea
              id={`otherMedia-${userId}`}
              name="otherMedia"
              value={userData.otherMedia}
              onChange={handleChange}
              placeholder="Enter any other media interests or preferences"
              rows={2}
              className="block w-full bg-neutral-800 border border-neutral-600 text-gray-300 placeholder-gray-500 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-neon-pink focus:border-neon-pink outline-none transition-all duration-150 shadow-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
