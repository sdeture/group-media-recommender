import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

const HeroSection = () => {
  const handleScrollToContent = () => {
    const contentElement = document.getElementById('info-stack-container');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-[90vh] w-full flex flex-col justify-center items-center bg-black text-white text-center p-4 md:p-8 relative animate-fadeIn">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        Discover Your Next Group Obsession
      </h1>
      <p className="font-light text-lg sm:text-xl md:text-2xl max-w-3xl text-white mt-2 mb-12">
        Tailored media recommendations for you and your friends, powered by AI.
      </p>
      <button 
        onClick={handleScrollToContent} 
        className="mt-16 text-4xl text-white animate-bounce-custom hover:text-white transition-colors duration-300" 
        aria-label="Scroll to content"
      >
        <FaChevronDown />
      </button>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue rounded-full"></div>
    </section>
  );
};

export default HeroSection;
