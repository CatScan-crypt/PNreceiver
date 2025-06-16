import express, { type Request, type Response } from 'express';
import { connectToRedis, redisClient } from './redis.js';

const app = express();
const port = process.env.PORT || 3002;

// Add JSON parsing middleware
app.use(express.json());


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

    console.log('Retrieved all tokens:');
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
    const existingUser = await redisClient.hGetAll(`user:${token}`);

    if (Object.keys(existingUser).length > 0) {
      // If token exists, update it with new browser info and an updated timestamp
      await redisClient.hSet(`user:${token}`, {
        ...existingUser,
        browserType,
        browserVersion,
        updatedAt: new Date().toISOString()
      });

      console.log(`🔵 [Vercel] Updated browser info for token: ${token}`);
      res.status(200).json({
        message: 'Browser information updated successfully',
        id: existingUser.id,
        token
      });
    } else {
      // If token doesn't exist, create a new entry
      const id = Date.now().toString();
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
    }
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
