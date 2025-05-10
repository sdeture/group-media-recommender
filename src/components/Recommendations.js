import React from 'react';

const Recommendations = ({ recommendations, loading, error }) => {
  return (
    <div className="bg-neutral-800/70 backdrop-blur-sm rounded-xl neon-glow border border-neon-pink mb-8 shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div className="px-6 pt-5 pb-3 border-b border-neon-pink/50">
        <h4 className="text-xl font-semibold tracking-tight text-white">Group Recommendations</h4>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neon-blue mx-auto"></div>
            <p className="mt-3 text-white">Generating personalized recommendations...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-700 text-white px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : recommendations && recommendations.length > 0 ? (
          <>
            <p className="mb-4 text-white">Based on everyone's preferences and history, here are some recommendations for your group:</p>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-neutral-700/30 p-4 rounded-lg border border-neutral-600/50">
                  <h5 className="text-lg font-semibold text-white mb-1">{rec.title}</h5>
                  <p className="mb-1 text-white text-sm">{rec.description}</p>
                  {rec.type && <small className="text-xs text-white block">Type: {rec.type}</small>}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-sky-900/50 border border-sky-700 text-white px-4 py-3 rounded-lg text-center">
            Fill in user preferences and click "Get Recommendations" to receive personalized suggestions for your group.
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
