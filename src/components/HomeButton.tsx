// src/components/HomeButton.tsx

import React from 'react';

interface HomeButtonProps {
  onClick: () => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 px-4 py-2 bg-secondary text-surface rounded font-semibold shadow-md"
    >
      Home
    </button>
  );
};

export default HomeButton;
