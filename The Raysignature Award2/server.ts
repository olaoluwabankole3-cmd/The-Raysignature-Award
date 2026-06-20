import express from "express";
import path from "path";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

// API Endpoint for Acceptance Speech generation using Thinking Mode
app.post("/api/speech", async (req, res) => {
  try {
    const { awardName, recipient, tone, thanks, inspiration } = req.body;
    if (!awardName || !recipient) {
      return res.status(400).json({ error: "Missing required fields: awardName and recipient are required." });
    }

    const ai = getGeminiClient();
    const prompt = `Write a premium, high-impact, emotionally resonant and cinematic acceptance speech for an award ceremony.
Award Category: ${awardName}
Recipient Name: ${recipient}
Tone/Vibe: ${tone || 'emotional & inspiring'}
Special Thanks: ${thanks || 'the Academy, peers, and family'}
Key Inspiration/Message: ${inspiration || 'unwavering persistence and collaboration'}

Structure the response beautifully with markdown, with cinematic stage directions in brackets, e.g., "*[Takes a deep breath as the crowd continues to cheer, holding the golden trophy closely]*". Highlight powerful quotes, emotional pauses, and close with a majestic, memorable final line. Make it feel incredibly grand like the Academy Awards, Oscars, or a prestigious galas. Make sure to draft a complete, beautiful piece.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH
        }
      }
    });

    res.json({ speech: response.text });
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: error.message || "Failed to generate acceptance speech." });
  }
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🎬 Cinematic Award Ceremony server running on http://localhost:${PORT}`);
  });
}

setupVite();
