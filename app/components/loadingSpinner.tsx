import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className='flex justify-center items-center'>
      <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900'></div>
    </div>
  );
};

export default LoadingSpinner;
