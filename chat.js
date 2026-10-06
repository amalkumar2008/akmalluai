import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "OPENAI_API_KEY is not configured on the server." });
    }

    const { message, history = [] } = req.body || {};
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const safeHistory = Array.isArray(history)
      ? history
          .filter(x => x && (x.role === "user" || x.role === "assistant") && typeof x.content === "string")
          .slice(-20)
          .map(x => ({ role: x.role, content: x.content.slice(0, 12000) }))
      : [];

    const client = new OpenAI({ apiKey });
    const model = process.env.OPENAI_MODEL || "gpt-6-astra";

    const response = await client.responses.create({
      model,
      instructions: `You are Kerala AI, a friendly general-purpose AI assistant.\nRespond clearly and helpfully. You can understand English and Malayalam.\nThe website is Kerala-inspired, but do not force Kerala references into unrelated answers.`,
      input: [
        ...safeHistory,
        { role: "user", content: message.trim().slice(0, 12000) }
      ]
    });

    return res.status(200).json({
      reply: response.output_text || "Sorry, I couldn't generate a response.",
      responseId: response.id
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "AI request failed.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}
