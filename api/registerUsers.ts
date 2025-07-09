import { Express, type Request, type Response } from 'express';
import { redisClient } from './redis.js';

export function registerBrowserInfoEndpoint(app: Express) {
  app.post('/api/register', async (req: Request, res: Response): Promise<void> => {
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
}
