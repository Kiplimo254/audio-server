import express from "express";
import fetch from "node-fetch";

const app = express();

// health check
app.get("/", (req, res) => {
  res.send("✅ Audio proxy is running");
});

// proxy audio stream
app.get("/stream", async (req, res) => {
  try {
    const audioRes = await fetch("http://197.248.191.199:88/broadwavehigh.mp3?src=1");

    if (!audioRes.ok || !audioRes.body) {
      throw new Error("Failed to fetch audio stream");
    }

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Access-Control-Allow-Origin", "*");

    audioRes.body.pipe(res);

    audioRes.body.on("error", (err) => {
      console.error("Audio stream error:", err);
      res.end();
    });
  } catch (err) {
    console.error("Stream error:", err);
    res.status(500).send("Stream unavailable");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));
