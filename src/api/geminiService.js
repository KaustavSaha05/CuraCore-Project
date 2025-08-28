// src/api/geminiService.js

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

// --- THIS IS THE ONLY LINE THAT CHANGED ---
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
// ------------------------------------------

export const analyzeReport = async (reportText) => {
  console.log("Sending report to Gemini for analysis...");
  const prompt = `Please explain this medical report in simple, easy-to-understand terms for a non-medical person. Focus on key findings and suggest general, non-prescriptive next steps: "${reportText}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error analyzing report with Gemini:", error);
    return "Sorry, there was an error analyzing the report. Please try again.";
  }
};

export const getChatbotResponse = async (message) => {
  console.log("Sending message to Gemini for chatbot response...");
  const prompt = `You are a helpful and safe healthcare assistant. Answer the following user question clearly and concisely. Always include a disclaimer that you are not a medical professional and the user should consult a doctor. User question: "${message}"`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error getting chatbot response from Gemini:", error);
    return "Sorry, I'm having trouble connecting. Please try again later.";
  }
};