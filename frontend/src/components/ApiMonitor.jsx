import { useState, useEffect } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';
import axios from 'axios';

/**
 * ApiMonitor component checks the health of the backend API
 * and shows a notification when there are connectivity issues
 */
const ApiMonitor = () => {
  const [apiStatus, setApiStatus] = useState('unknown'); // 'unknown', 'online', 'offline'
  const [showBanner, setShowBanner] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    // Only show the banner when the API is offline
    setShowBanner(apiStatus === 'offline');
  }, [apiStatus]);

  // Check API health on initial load and every 30 seconds
  useEffect(() => {
    // Create a custom axios instance just for health checks
    // This avoids any interceptors or middleware from the main axios instance
    const healthCheck = axios.create({
      baseURL: 'http://localhost:5050',
      timeout: 5000
    });

    const checkApiHealth = async () => {
      try {
        const response = await healthCheck.get('/health');
        
        // Check if response is actually OK (status might be 200 but with error state in payload)
        if (response.data?.status === 'ok') {
          if (apiStatus === 'offline') {
            // API is back online after being offline
            setApiStatus('online');
            console.log('API is back online');
          } else {
            setApiStatus('online');
          }
          
          // Reset retry count when successful
          setRetryCount(0);
        } else {
          throw new Error('API health check returned non-OK status');
        }
      } catch (error) {
        console.error('API health check failed:', error.message);
        setApiStatus('offline');
        
        // Increase retry count to adjust interval
        setRetryCount(prev => Math.min(prev + 1, 5));
      }
    };

    // Check immediately
    checkApiHealth();
    
    // Calculate retry interval - we'll back off if there are persistent issues
    // Starting at 30s, then 60s, 90s, etc. up to 150s
    const retryInterval = 30000 + (30000 * retryCount);
    
    // Set up recurring check
    const intervalId = setInterval(checkApiHealth, retryInterval);
    
    return () => clearInterval(intervalId);
  }, [apiStatus, retryCount]);

  const handleRetryNow = () => {
    setApiStatus('unknown');
    // The effect will trigger a new health check
  };

  // Don't render anything if the API is online or status is unknown
  if (apiStatus !== 'offline' || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-red-800 text-white p-4 rounded-lg shadow-lg flex items-start">
        <div className="mr-3 mt-0.5">
          <WifiOff className="h-5 w-5 text-red-300" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">Connection Issues</h3>
            <button 
              onClick={() => setShowBanner(false)} 
              className="ml-4 text-red-200 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-sm mt-1 text-red-200">
            We're having trouble connecting to our servers. Your data may not be saved.
          </p>
          
          <button
            onClick={handleRetryNow}
            className="mt-2 text-xs bg-red-700 hover:bg-red-600 px-3 py-1.5 rounded-md inline-flex items-center"
          >
            <Wifi className="h-3.5 w-3.5 mr-1" />
            Retry connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiMonitor; 