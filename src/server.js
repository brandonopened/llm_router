import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

import { routePrompt } from './router.js';
import askOpenAI from './llmClients/openai.js';
import askClaude from './llmClients/claude.js';
import askGemini from './llmClients/gemini.js';
import askGrok from './llmClients/grok.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const AUTH_PASSWORD = process.env.AUTH_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

function requireAuth(req, res, next) {
  const sessionToken = req.cookies.sessionToken;
  
  if (!sessionToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const expectedToken = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update('authenticated')
      .digest('hex');
    
    if (sessionToken !== expectedToken) {
      return res.status(401).json({ error: 'Invalid session' });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid session' });
  }
}

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  
  if (!password || password !== AUTH_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  
  const sessionToken = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update('authenticated')
    .digest('hex');
  
  res.cookie('sessionToken', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  res.json({ success: true });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('sessionToken');
  res.json({ success: true });
});

app.post('/api/route', requireAuth, async (req, res) => {
  try {
    const { prompt } = req.body;
    const route = await routePrompt(prompt);
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Router failure' });
  }
});

app.post('/api/ask', requireAuth, async (req, res) => {
  const { prompt, target } = req.body;
  console.log('Received target model:', JSON.stringify(target));
  try {
    let answer = 'Unknown target model';
    switch (target) {
      case 'gpt-4o':
        answer = await askOpenAI(prompt, 'gpt-4o');
        break;
      case 'gpt-4o-mini':
        answer = await askOpenAI(prompt, 'gpt-4o-mini');
        break;
      case 'claude-sonnet-4-20250514':
        answer = await askClaude(prompt, 'claude-sonnet-4-20250514');
        break;
      case 'gemini-2-0-flash-exp':
        answer = await askGemini(prompt);
        break;
      case 'grok-4':
        answer = await askGrok(prompt);
        break;
    }
    console.log('LLM answer:', JSON.stringify(answer));
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Downstream model failed' });
  }
});

// Determine ports: try default 3005 when no PORT env set, otherwise use configured PORT
const DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3005;
const FALLBACK_PORT = 3000;

// Start server on desired port, fallback if default port is already in use
const server = app.listen(DEFAULT_PORT, () => {
  console.log(`🚀 Server running on http://localhost:${DEFAULT_PORT}`);
});
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE' && !process.env.PORT) {
    console.warn(`Port ${DEFAULT_PORT} is in use, falling back to ${FALLBACK_PORT}`);
    server.listen(FALLBACK_PORT, () => {
      console.log(`🚀 Server running on http://localhost:${FALLBACK_PORT}`);
    });
  } else {
    console.error(err);
    process.exit(1);
  }
});
