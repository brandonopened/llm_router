# LLM Router JS Demo

Quick demo that routes a user prompt to the best downstream LLM (GPT‑4o, Claude 3 Opus, Gemini 2.0 Flash, or Grok 1.5) using a first *router* call.
It shows the JSON rationale **and** the final answer in a tiny web UI written with Express + vanilla JS.

## 1. Setup

```bash
git clone <repo>            # or download & unzip
cd llm-router-js
cp .env.example .env        # fill in your API keys
npm install
```

## 2. Run local dev server

```bash
npm run dev         # nodemon auto‑reload
# or
npm start           # plain node
```

Open http://localhost:3005 in your browser (falls back to 3000 if 3005 is in use).

## 3. Files

```
src/
 ├── server.js          # Express API + static files
 ├── routerPrompt.txt   # system prompt for router
 ├── router.js          # calls GPT‑4o to pick downstream model
 └── llmClients/        # thin wrappers around each vendor SDK
     ├── openai.js
     ├── claude.js
     ├── gemini.js
     └── grok.js
public/
 ├── index.html         # simple GUI
 └── app.js             # browser logic
```

## 4. Deploy

Any Node‑compatible host (Render, Fly.io, Railway).  Set environment
variables identical to `.env.example`.

---

⚠️ **Security**: The server proxies all LLM calls so your keys never hit the browser.  Rate‑limit or add auth if you expose this demo.
