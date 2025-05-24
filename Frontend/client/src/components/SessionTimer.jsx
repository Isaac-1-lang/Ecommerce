import React from 'react';
import { useAppContext } from '../context/AppContext';

const SessionTimer = () => {
  const { sessionTimeLeft, isSessionActive } = useAppContext();

  if (!isSessionActive) return null;

  const minutes = Math.floor(sessionTimeLeft / 60);
  const seconds = sessionTimeLeft % 60;

  return (
    <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="text-sm font-semibold">Session expires in:</div>
      <div className="text-lg font-bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default SessionTimer; 