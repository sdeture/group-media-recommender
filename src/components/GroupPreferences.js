import React from 'react';

const GroupPreferences = ({ preferences, setPreferences }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const fields = [
    {
      name: 'mediaInterests',
      label: 'What types of media are you interested in watching/consuming together?',
      placeholder: 'E.g., action movies, comedy shows, documentaries about nature...',
      rows: 3,
    },
    {
      name: 'mediaAvoid',
      label: 'What types of media do you want to avoid?',
      placeholder: 'E.g., horror movies, political documentaries...',
      rows: 3,
    },
    {
      name: 'moodTheme',
      label: 'Any specific mood or theme you\'re looking for?',
      placeholder: 'E.g., uplifting, educational, nostalgic...',
      rows: 2,
    },
    {
      name: 'additionalComments',
      label: 'Additional comments',
      placeholder: 'Any other preferences or requirements...',
      rows: 2,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-xl neon-glow border border-neon-blue mb-12 shadow-xl overflow-hidden max-w-2xl mx-auto">
      <div className="px-6 pt-5 pb-3 border-b border-neon-blue/50">
        <h4 className="text-xl font-semibold tracking-tight text-white">Group Preferences</h4>
      </div>
      <div className="p-6 space-y-[4.375rem]">
        <form>
          {fields.map(field => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-normal text-white py-4 mb-1.5">
                {field.label}
              </label>
              <textarea
                id={field.name}
                name={field.name}
                value={preferences[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={field.rows}
                className="block w-full bg-neutral-800 border border-neutral-600 text-gray-300 placeholder-gray-500 rounded-lg py-2.5 px-3 focus:ring-2 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all duration-150 shadow-sm resize-none"
              />
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default GroupPreferences;
