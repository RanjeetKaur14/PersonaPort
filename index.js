import express from "express";
import cors from "cors";
import OpenAI from "openai";
import multer from "multer";
import fetch from "node-fetch";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import dotenv from "dotenv";
dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

const upload = multer();


const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});



app.post("/api/palette", async (req, res) => {
  try {
    const response = await fetch("http://colormind.io/api/", {
      method: "POST",
      body: JSON.stringify({ model: "default" })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Palette fetch failed:", error);
    res.status(500).json({ error: "Palette fetch failed" });
  }
});


function buildJsonPrompt(sourceText) {
  return `
You are a portfolio data generator.

Return ONLY valid JSON.
Do NOT include explanations, markdown, headings, or extra text.
Do NOT wrap the response in backticks.

The JSON structure MUST be exactly:

{
  "name": "",
  "role": "",
  "summary": "",
  "about": [],
  "skills": [
    {
      "title": "",
      "items": []
    }
  ],
  "projects": [
    {
      "title": "",
      "description": "",
      "tech": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institute": ""
    }
  ],
  "contact": {
    "email": "",
    "github": "",
    "linkedin": ""
  }
}

Use the text below to fill the data accurately.

TEXT:
${sourceText}
`;
}


function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ AI RETURNED INVALID JSON:\n", raw);
    throw new Error("Invalid JSON from AI");
  }
}

/* ---------- MANUAL FORM ---------- */
app.post("/generate", async (req, res) => {
  try {
    const { name, industry, role, experience } = req.body;

    const sourceText = `
Name: ${name}
Industry: ${industry}
Role: ${role}
Experience: ${experience}
`;

    const prompt = buildJsonPrompt(sourceText);

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const raw = response.choices[0].message.content;
    const parsed = safeJsonParse(raw);

    res.json({
      portfolio: parsed,
      source: "Manual Form + AI"
    });

  } catch (err) {
    console.error("GENERATE ERROR:", err.message);
    res.status(500).json({ error: "AI generation failed" });
  }
});

/* ---------- RESUME UPLOAD ---------- */
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const data = new Uint8Array(req.file.buffer);
    const pdf = await pdfjsLib.getDocument({ data }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ");
    }

    const prompt = buildJsonPrompt(text.slice(0, 3000));

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }]
    });

    const raw = response.choices[0].message.content;
    const parsed = safeJsonParse(raw);

    res.json({
      portfolio: parsed,
      source: "Resume Upload + AI"
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err.message);
    res.status(500).json({ error: "Resume processing failed" });
  }
});


app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
