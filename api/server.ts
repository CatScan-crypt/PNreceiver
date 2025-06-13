import express, { type Request, type Response } from 'express';
import { connectToRedis, redisClient } from './redis.js';

const app = express();
const port = process.env.PORT || 3001;

// Add JSON parsing middleware
app.use(express.json());

// Endpoint to fetch a user by ID
app.get('/api/user/:id', async (req: Request, res: Response): Promise<void> => {
  console.log(`🟡 [Vercel] Received request for user: ${req.params.id}`);
  try {
    const user = await redisClient.hGetAll(`user:${req.params.id}`);
    console.log('Current user data in Redis:', user);
    if (Object.keys(user).length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error('🔴 [Vercel] Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch data from Redis' });
  }
});

// New endpoint to get all tokens
app.get('/api/tokens', async (req: Request, res: Response): Promise<void> => {
  try {
    // Get all keys that start with 'user:'
    const keys = await redisClient.keys('user:*');
    const tokens = [];

    // Fetch data for each key
    for (const key of keys) {
      const userData = await redisClient.hGetAll(key);
      if (Object.keys(userData).length > 0) {
        tokens.push({
          id: key.replace('user:', ''),
          ...userData
        });
      }
    }

    console.log('Retrieved all tokens:', tokens);
    res.json({ tokens });
  } catch (error) {
    console.error('🔴 [Vercel] Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens from Redis' });
  }
});

// New endpoint to store browser information
app.post('/api/browser-info', async (req: Request, res: Response): Promise<void> => {
  const { token, browserType, browserVersion } = req.body;
  
  if (!token || !browserType || !browserVersion) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    // Check if token already exists
    const existingUser = await redisClient.hGetAll(`user:${token}`);
    if (Object.keys(existingUser).length > 0) {
      res.status(409).json({ error: 'Token already exists' });
      return;
    }

    // Generate a unique ID for the token
    const id = Date.now().toString();

    // Store the browser information
    await redisClient.hSet(`user:${token}`, {
      id,
      browserType,
      browserVersion,
      token,
      createdAt: new Date().toISOString()
    });

    console.log(`🟢 [Vercel] Stored browser info for token: ${token}`);
    res.status(201).json({ 
      message: 'Browser information stored successfully',
      id,
      token
    });
  } catch (error) {
    console.error('🔴 [Vercel] Error storing browser information:', error);
    res.status(500).json({ error: 'Failed to store data in Redis' });
  }
});

const startServer = async () => {
  try {
    await connectToRedis();
    console.log('Connected to Redis successfully!');

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('🔴 [Vercel] Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
