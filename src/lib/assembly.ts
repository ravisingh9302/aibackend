import axios from "axios";
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import { Readable } from "stream";
import dotenv from "dotenv";

dotenv.config();

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY!;
const AUDIO_SAVE_PATH = path.join(__dirname, "../audio"); 

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_SAVE_PATH)) {
  fs.mkdirSync(AUDIO_SAVE_PATH, { recursive: true });
}

/**
 * Converts text to speech and saves the audio file locally.
 * @param text - The text to convert to speech.
 * @returns The local path to the saved audio file.
 */
export async function textToSpeech(text: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://api.assemblyai.com/v2/text-to-speech",
      { text, voice: "female" },
      { headers: { Authorization: ASSEMBLYAI_API_KEY, "Content-Type": "application/json" } }
    );

    if (!response.data.audio_url) throw new Error("TTS API failed.");

    const audioData = await axios.get(response.data.audio_url, { responseType: "arraybuffer" });

    const fileName = `audio_${Date.now()}.mp3`;
    const filePath = path.join(AUDIO_SAVE_PATH, fileName);
    fs.writeFileSync(filePath, Buffer.from(audioData.data));

    return `/audio/${fileName}`; // Keeping the relative URL for frontend access
  } catch (error) {
    console.error("Error in TTS:", error);
    throw new Error("Failed to generate speech.");
  }
}

/**
 * Starts real-time speech-to-text (STT) conversion using WebSockets.
 * @param audioStream - The readable audio stream.
 * @returns The transcribed text.
 */
export async function startRealTimeSTT(audioStream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket("wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000", {
      headers: { Authorization: ASSEMBLYAI_API_KEY },
    });

    let transcript = "";

    ws.on("open", () => {
      console.log("✅ WebSocket connection opened for STT");
      audioStream.on("data", (chunk) => ws.send(chunk));
    });

    ws.on("message", (data: any) => {
      const result = JSON.parse(data.toString());
      if (result.text) transcript = result.text;
    });

    ws.on("close", () => resolve(transcript));
    ws.on("error", reject);
  });
}
