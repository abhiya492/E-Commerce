import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Create a mock implementation for Redis functions if connection fails
const createMockRedis = () => {
  console.log("⚠️ Using mock Redis implementation");
  const store = new Map();
  
  return {
    set: async (key, value, ...args) => {
      // Handle EX argument for expiration
      let expiry = null;
      for (let i = 0; i < args.length; i++) {
        if (args[i] === "EX" && i + 1 < args.length) {
          expiry = Date.now() + (args[i + 1] * 1000);
          break;
        }
      }
      store.set(key, { value, expiry });
      return "OK";
    },
    get: async (key) => {
      const item = store.get(key);
      if (!item) return null;
      if (item.expiry && item.expiry < Date.now()) {
        store.delete(key);
        return null;
      }
      return item.value;
    },
    del: async (key) => {
      const exists = store.has(key);
      store.delete(key);
      return exists ? 1 : 0;
    },
    // Add more Redis commands as needed
    flushall: async () => {
      store.clear();
      return "OK";
    },
    keys: async (pattern) => {
      // Simple pattern matching (only supports *)
      if (pattern === "*") {
        return Array.from(store.keys());
      }
      return [];
    },
    // Simple logging for debugging
    _debug: () => {
      console.log("Mock Redis store contents:", store);
      return true;
    }
  };
};

// Configuration for Redis connections
const getRedisConfig = () => {
  // Default config with reasonable timeouts and retry strategy
  return {
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      console.log(`Redis retry attempt: ${times}`);
      if (times > 3) {
        console.log("Too many Redis connection attempts, using mock implementation");
        return null; // Stop retrying after 3 attempts
      }
      return Math.min(times * 100, 3000); // Retry with increasing delay
    },
    enableOfflineQueue: false, // Don't queue commands when disconnected
  };
};

// Try to connect to Redis or use mock implementation
let redisClient;

const initializeRedis = () => {
  try {
    // Check if local Redis mode is explicitly enabled
    if (process.env.USE_LOCAL_REDIS === 'true') {
      console.log("Using local Redis instance");
      redisClient = new Redis({
        ...getRedisConfig(),
        host: 'localhost',
        port: 6379,
      });
    } 
    // Otherwise use Upstash Redis if URL is available
    else if (process.env.UPSTASH_REDIS_URL) {
      console.log("Using Upstash Redis instance");
      redisClient = new Redis(process.env.UPSTASH_REDIS_URL, getRedisConfig());
    } 
    // Fall back to mock if no Redis configuration is available
    else {
      console.log("No Redis URL provided, using mock implementation");
      redisClient = createMockRedis();
      return; // No need to set up event listeners for mock
    }
    
    // Set up event listeners for real Redis connections
    redisClient.on('error', (err) => {
      console.log(`Redis connection error: ${err.message}`);
      if (
        err.message.includes('ENOTFOUND') || 
        err.message.includes('ETIMEDOUT') ||
        err.message.includes('ECONNREFUSED')
      ) {
        console.log("Switching to mock Redis implementation");
        // Save the original client to close it properly
        const originalClient = redisClient;
        
        // Switch to mock implementation
        redisClient = createMockRedis();
        
        // Close the original client in the background
        try {
          originalClient.disconnect();
        } catch (e) {
          // Ignore errors while disconnecting
        }
      }
    });
    
    redisClient.on('connect', () => {
      console.log("Redis connected successfully");
    });
    
    // Test connection
    redisClient.ping().then(() => {
      console.log("Redis PING successful");
    }).catch(err => {
      console.log(`Redis PING failed: ${err.message}`);
    });
    
  } catch (error) {
    console.log(`Error initializing Redis: ${error.message}`);
    redisClient = createMockRedis();
  }
};

// Initialize Redis connection
initializeRedis();

// Provide a way to check if we're using mock implementation
export const isMockRedis = () => {
  return !redisClient.options; // Mock implementation doesn't have options
};

// Export the Redis client
export const redis = redisClient;

// Export a function to reinitialize Redis (useful for testing or recovery)
export const reinitializeRedis = () => {
  if (redisClient && typeof redisClient.disconnect === 'function') {
    try {
      redisClient.disconnect();
    } catch (e) {
      // Ignore errors while disconnecting
    }
  }
  initializeRedis();
  return redis;
};

// redis=key-value store gaint json 