require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/recommendations', async (req, res) => {
  try {
    const { users, preferences } = req.body;
    
    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'User data is required' });
    }

    // Format the input for OpenAI
    const prompt = generatePrompt(users, preferences);
    
    console.log('Sending request to OpenAI o3 model...');
    
    // Make request to OpenAI o3 model
    const response = await openai.chat.completions.create({
      model: "o3",
      messages: [{ role: "user", content: prompt }],
      // max_tokens: 1000, // Optional: can be added if needed for response length control
    });
    
    console.log('Response from OpenAI:', JSON.stringify(response, null, 2));
    
    // Parse OpenAI's response to extract recommendations
    // The o3 model might return the response in a format similar to other chat completion models
    const recommendations = parseRecommendations(response.choices[0].message.content);
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ 
      error: 'Failed to generate recommendations',
      details: error.message 
    });
  }
});

// Helper function to generate prompt for OpenAI
function generatePrompt(users, preferences) {
  let userProfiles = users.map((user, index) => {
    return `User ${index + 1} (${user.name || 'Unnamed user'}):
    - Spotify tracks: ${user.spotifyTracks || 'Not provided'}
    - YouTube history: ${user.youtubeHistory || 'Not provided'}
    - Netflix history: ${user.netflixHistory || 'Not provided'}
    - Other media interests: ${user.otherMedia || 'Not provided'}`;
  }).join('\n\n');
  
  let groupPrefs = `
Group Preferences:
- Media interests: ${preferences.mediaInterests || 'Not specified'}
- Media to avoid: ${preferences.mediaAvoid || 'Not specified'}
- Mood/theme: ${preferences.moodTheme || 'Not specified'}
- Additional comments: ${preferences.additionalComments || 'Not specified'}`;

  return `Based on the following user profiles and group preferences, provide 5 specific media recommendations (movies, TV shows, documentaries, YouTube channels, music, etc.) that would be enjoyable for the entire group to consume together.

${userProfiles}

${groupPrefs}

For each recommendation, provide:
1. Title
2. Brief description explaining why it's a good fit for this group
3. Type of media (movie, TV show, etc.)

Format your response as a list of recommendations, with each recommendation including these three components.`;
}

// Helper function to parse OpenAI's response
function parseRecommendations(content) {
  // This is a simple parser that could be improved with regex or more sophisticated parsing
  try {
    const recommendations = [];
    
    // Split by numbered recommendations (1., 2., etc.)
    const items = content.split(/\d+\.\s+/).filter(item => item.trim().length > 0);
    
    for (const item of items) {
      const lines = item.split('\n').filter(line => line.trim().length > 0);
      
      if (lines.length > 0) {
        const title = lines[0].replace(/^[^a-zA-Z0-9]*/, '').trim();
        let description = '';
        let type = '';
        
        // Look for description and type
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.toLowerCase().startsWith('type:') || line.match(/^[^:]+:\s*[a-zA-Z]/)) {
            type = line.split(':')[1].trim();
          } else {
            description += line + ' ';
          }
        }
        
        recommendations.push({
          title,
          description: description.trim(),
          type
        });
      }
    }
    
    return recommendations.length > 0 ? recommendations : [
      {
        title: "No specific recommendations found",
        description: "The AI response didn't contain properly formatted recommendations. You might want to try again with more specific preferences.",
        type: "Error"
      }
    ];
  } catch (error) {
    console.error('Error parsing recommendations:', error);
    return [
      {
        title: "Error parsing recommendations",
        description: "There was an error processing the AI response. Please try again.",
        type: "Error"
      }
    ];
  }
}

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
