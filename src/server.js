import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/route', async (req, res) => {
  try {
    const { prompt } = req.body;
    const route = await routePrompt(prompt);
    res.json(route);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Router failure' });
  }
});

app.post('/api/ask', async (req, res) => {
  const { prompt, target } = req.body;
  console.log('Received target model:', JSON.stringify(target));
  try {
    let answer = 'Unknown target model';
    switch (target) {
      case 'gpt-4o':
        answer = await askOpenAI(prompt, 'gpt-4o');
        break;
      case 'o3-pro':
        answer = await askOpenAI(prompt, 'o3-pro');
        break;
      case 'o3-mini':
        answer = await askOpenAI(prompt, 'o3-mini');
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
