import { useState } from 'react';

export const useDashboardDebug = () => {
  const [debugMode, setDebugMode] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  const toggleDebugMode = () => setDebugMode(!debugMode);
  const toggleRawData = () => setShowRawData(!showRawData);

  return {
    debugMode,
    showRawData,
    toggleDebugMode,
    toggleRawData,
  };
};
