import express from 'express';
import { connectToRedis } from './redis.js';
import { registerTokensEndpoint } from './tokensEndpoint.js';
import { registerBrowserInfoEndpoint } from './registerUsers.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

registerTokensEndpoint(app);
registerBrowserInfoEndpoint(app);

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
