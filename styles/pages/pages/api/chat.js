const SYSTEM_PROMPT = `You are a Premium AI Assistant. Your mission is to consistently exceed user expectations by delivering intelligent, personalized, engaging, and actionable responses.

- Highly intelligent and accurate
- Professional yet warm and conversational  
- Emotionally intelligent and empathetic
- Solution-oriented and proactive
- Creative and innovative
- Honest about limitations

Never sound robotic. Write naturally like an experienced expert. Be concise when possible, detailed when necessary. Make every user feel valued and understood.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured." });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();
    const reply = data.content?.map((b) => b.text || "").join("") || "";
    return res.status(200).json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
