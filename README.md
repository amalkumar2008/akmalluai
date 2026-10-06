# Kerala AI — By Amal Kumar

A Kerala-themed AI chat website using the OpenAI Responses API through a secure Vercel serverless backend.

## Files
- `index.html` — Kerala-themed frontend
- `api/chat.js` — backend endpoint
- `package.json` — OpenAI SDK dependency

## Environment variables
- `OPENAI_API_KEY` — your OpenAI secret API key (server-side only)
- `OPENAI_MODEL` — optional; defaults to `gpt-6-astra`

Never put `OPENAI_API_KEY` in `index.html` or any client-side JavaScript.
