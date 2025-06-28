const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // load the .env file
console.log("API Key:", process.env.TOGETHER_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.TOGETHER_API_KEY;
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';

app.post('/api/hint', async (req, res) => {
  const { question } = req.body;
  console.log("📨 Hint request received. Body:", req.body);

  try {
    // Replace your existing fetch call with this updated version:
    const response = await fetch(TOGETHER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that provides hints."
          },
          {
            role: "user",
            content: `Give one helpful hint (but not the answer) for: ${question}`
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Together AI Error:", error);
      return res.status(500).json({ hint: "Sorry, I couldn't generate a hint." });
    }

    const data = await response.json();
    const hint = data.choices[0].message.content.trim();
    res.json({ hint });

  } catch (err) {
    console.error("❌ General Error:", err);
    res.status(500).json({ hint: "Sorry, an unexpected error occurred." });
  }
});

app.listen(3000, () => {
  console.log("🚀 Together AI Hint Server running at http://localhost:3000");
});
