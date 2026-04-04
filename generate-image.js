import { GoogleGenAI } from "@google/genai";
import fs from "fs";

async function main() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    console.log("Generating image...");
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: 'ultra-realistic humanoid trading robot, metallic body with subtle blue glowing accents, interacting with a stock chart on screen, dark fintech environment, cinematic lighting, high detail, realistic reflections, depth of field, no cartoon or illustration style, professional investment look',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        fs.writeFileSync('public/trading-robot.png', Buffer.from(base64EncodeString, 'base64'));
        console.log("Image saved to public/trading-robot.png");
        break;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

main();
