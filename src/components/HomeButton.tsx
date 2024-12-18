// src/components/HomeButton.tsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

const HomeButton: React.FC = () => {
  const router = useRouter();

  const navigateHome = () => {
    router.push('/');
  };

  return (
    <button
      onClick={navigateHome}
      className="fixed top-4 left-4 px-4 py-2 bg-secondary text-surface rounded font-semibold shadow-md"
    >
      Home
    </button>
  );
};

export default HomeButton;
