import React, { createContext, useState, useContext } from 'react';

/**
 * ProcessedDataContext - Global state for dynamic form data results
 * Allows components to share dynamic form data without prop drilling
 */
const ProcessedDataContext = createContext();

export const ProcessedDataProvider = ({ children }) => {
  const [processedData, setProcessedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProcessedData = (data) => {
    setProcessedData(data);
    setError(null);
  };

  const clearProcessedData = () => {
    setProcessedData(null);
    setError(null);
  };

  const setProcessingError = (errorMessage) => {
    setError(errorMessage);
  };

  const value = {
    processedData,
    isLoading,
    error,
    updateProcessedData,
    clearProcessedData,
    setProcessingError,
    setIsLoading,
  };

  return (
    <ProcessedDataContext.Provider value={value}>
      {children}
    </ProcessedDataContext.Provider>
  );
};

/**
 * Hook to use ProcessedDataContext
 * Usage: const { processedData, updateProcessedData } = useProcessedData();
 */
export const useProcessedData = () => {
  const context = useContext(ProcessedDataContext);
  if (!context) {
    throw new Error('useProcessedData must be used within ProcessedDataProvider');
  }
  return context;
};

export default ProcessedDataContext;
