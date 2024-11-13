import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-24">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
