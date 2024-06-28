"use client";

import React, { useEffect, useState } from 'react';

const MediaQuery = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Set initial value on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      {isDesktop ? (
        <div className="desktop-only">
          {children}
        </div>
      ) : (
        <div className="mobile-warning flex items-center justify-center h-screen">
          <p className='font-bold'>This application is best optimised on desktop/laptop screens :)</p>
        </div>
      )}
    </div>
  );
};

export default MediaQuery;
