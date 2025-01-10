import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LiveTime: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex items-center text-gray-300 bg-gray-800/50 backdrop-blur-lg rounded-md px-3 py-1">
      <Clock className="w-4 h-4 mr-2 text-aqua-400" />
      <span className="text-sm font-medium">
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
};

export default LiveTime;

