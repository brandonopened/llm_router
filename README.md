# LLM Router JS Demo

This project is a multi-model LLM router and demo web app. It routes user prompts to the best downstream LLM (OpenAI GPT-4o, Claude Sonnet, Gemini Flash, or Grok) and provides a clear rationale for its choice. The app also offers smart suggestions for building apps, websites, and multimedia content using external tools like Replit and Gamma.

## Features & Capabilities

- **Automatic Model Routing:**
  - Picks the best LLM for each user prompt and explains the decision.
  - Supports: `gpt-4o`, `gpt-4o-mini`, `claude-sonnet-4-20250514`, `gemini-2-0-flash-exp`, `grok-4`.
- **Product Plan Generation:**
  - If you ask for an app, website, or similar, the router will first generate a product plan (features, user flow, tech stack) before suggesting implementation steps.
- **Replit Integration Guidance:**
  - For app/website requests, suggests using [Replit](https://replit.com/) and provides step-by-step instructions and starter code.
- **Gamma Multimedia Suggestions:**
  - For multimedia conversion requests (e.g., "create a powerpoint from a word document"), suggests [Gamma](https://gamma.app/) and explains its strengths for presentations, documents, social media, and websites.
- **Modern, Responsive UI:**
  - Clean, mobile-friendly web interface with clear display of router decisions and LLM responses.
- **API Key Security:**
  - All API keys are kept server-side and never exposed to the browser.

## Setup

1. **Clone the repo:**
   ```bash
   git clone <repo-url>
   cd llm-router-js
   ```
2. **Add your API keys:**
   - Copy `.env.example` to `.env` and fill in your API keys for OpenAI, Anthropic, Google, and Grok:
     ```bash
     cp .env.example .env
     # Edit .env and add your keys
     ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the app:**
   ```bash
   npm run dev   # (nodemon, auto-reloads)
   # or
   npm start     # (plain node)
   ```
5. **Open in your browser:**
   - Visit [http://localhost:3005](http://localhost:3005) (or 3000 if 3005 is in use)

## Requirements
- Node.js 18+
- See `requirements.txt` for Python dependencies (if using Python for Grok or other models)

## File Structure
```
src/
 ├── server.js          # Express API + static files
 ├── routerPrompt.txt   # system prompt for router (with special rules)
 ├── router.js          # calls router LLM to pick downstream model
 └── llmClients/        # wrappers for each vendor SDK
     ├── openai.js
     ├── claude.js
     ├── gemini.js
     └── grok.js
public/
 ├── index.html         # web UI
 └── app.js             # browser logic
```

## Security
- The server proxies all LLM calls so your API keys are never exposed to the browser.
- For production, add rate limiting or authentication.

---

**Enjoy routing your prompts to the best LLM for the job, with smart product planning and tool suggestions!**
