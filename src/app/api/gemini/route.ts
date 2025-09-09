import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_TOKEN || "");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const weather = body.weather;

    const aiMessage = `
      The weather in ${weather.location.name} is ${weather.current.condition.text.toLowerCase()} 
      with a temperature of ${weather.current.temp_c}°C. 
      Please stay safe and carry an umbrella if needed. 
      Avoid going out during heavy rain and drive carefully. 
      Keep hydrated and enjoy your day!
    `;

    if (!aiMessage) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    
    // for fresh response
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(aiMessage);

    // direct fresh text (no memory of past calls)
    const text = result.response.text();

    return NextResponse.json({
      status: 200,
      message: "Gemini fresh response received",
      data: text,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
