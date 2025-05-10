// OpenTelemetry Initialization for Arize Phoenix
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api');

// Optional: For troubleshooting, uncomment the line below to see OTel diagnostic logs
// diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter({
  // url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
  // By default, Phoenix collector runs on http://localhost:4318/v1/traces
  // You can override this with OTEL_EXPORTER_OTLP_TRACES_ENDPOINT environment variable if needed.
});

const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations({
    // Example: disable fs instrumentation if it's too noisy for your use case
    // '@opentelemetry/instrumentation-fs': {
    //   enabled: false,
    // },
  })],
  // You can add a resource here to define service.name, service.version, etc.
  // resource: new Resource({
  //   [SemanticResourceAttributes.SERVICE_NAME]: 'media-recommender-backend',
  // }),
});

try {
  sdk.start();
  console.log('OpenTelemetry SDK started successfully.');
} catch (error) {
  console.error('Error starting OpenTelemetry SDK:', error);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry SDK shut down successfully.'))
    .catch((error) => console.error('Error shutting down OpenTelemetry SDK:', error))
    .finally(() => process.exit(0));
});

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
    
    // DEBUG: Log received data
    console.log('Received users data in backend:', JSON.stringify(users, null, 2));
    console.log('Received preferences data in backend:', JSON.stringify(preferences, null, 2));

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'User data is required' });
    }

    // Format the input for OpenAI
    const prompt = generatePrompt(users, preferences);
    
    // DEBUG: Log the generated prompt
    console.log('Generated prompt for OpenAI:', prompt);
    
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
- Common interests: ${preferences.commonInterests || 'Not specified'}
- Media interests: ${preferences.mediaInterests || 'Not specified'}
- Media to avoid: ${preferences.mediaToAvoid || 'Not specified'}
- Desired vibe/mood: ${preferences.vibe || 'Not specified'}`;

  return `You are a media recommendation expert tasked with finding perfect content for a group to enjoy together.

Approach this task in two stages:

STAGE 1: ANALYZE EACH USER'S PREFERENCES
For each user below, create a brief summary of their likely media preferences based on their provided information. Focus on genres, themes, and formats they might enjoy. Create this summary even if they provided minimal information. Try to extract meaningful insights from whatever information is available.

${userProfiles}

STAGE 2: GENERATE GROUP RECOMMENDATIONS
Based on your analysis of each individual user AND considering that EVERY USER SHOULD BE WEIGHTED EQUALLY (regardless of how much information they provided), generate 5 specific media recommendations that would be enjoyable for the entire group to consume together. Pay special attention to finding content that has broad appeal across potentially diverse tastes.

Also consider these group preferences:
${groupPrefs}

For each recommendation, provide:
1. Title
2. Brief description explaining why it's a good fit for this specific group (referencing individual user preferences where relevant)
3. Type of media (movie, TV show, YouTube channel, etc.)

Format your response as a list of recommendations, with each recommendation including these three components. Make sure the recommendations are specific and varied enough to appeal to everyone in the group.`;
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
