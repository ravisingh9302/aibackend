import { GoogleGenerativeAI } from "@google/generative-ai";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
dotenv.config();
const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.GEMINI_API_KEY!;

const genAi = new GoogleGenerativeAI(API_KEY);
const model = genAi.getGenerativeModel({ model: MODEL_NAME });


export const extractResumeInside = async (pdfBuffer: Buffer): Promise<any> => {
  try {
    // Extract text from the PDF
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;
    console.log("Extracted Resume Text:", extractedText);

    const prompt = ` 
    You are an AI assistant that extracts structured details from resumes.
    Analyze the following resume text and return a JSON object with the following details:
    
    {
      "name": "Full Name",
      "contact": {
        "email": "example@example.com",
        "phone": "123-456-7890",
        "linkedin": "linkedin.com/in/example"
      },
      "summary": "Brief professional summary",
      "skills": ["Skill 1", "Skill 2", "Skill 3"],
      "experience": [
        {
          "company": "Company Name",
          "position": "Job Title",
          "duration": "Start Date - End Date",
          "description": "Responsibilities and achievements"
        }
      ],
      "education": [
        {
          "institution": "University Name",
          "degree": "Degree Name",
          "field": "Field of Study",
          "duration": "Start Date - End Date"
        }
      ],
      "certifications": [
        {
          "name": "Certification Name",
          "issuer": "Issuer Organization",
          "year": "Year Earned"
        }
      ],
      "projects": [
        {
          "title": "Project Title",
          "description": "Brief project summary",
          "technologies": ["Tech 1", "Tech 2"]
        }
      ],
      "achievements": ["Achievement 1", "Achievement 2"],
      "languages": ["Language 1", "Language 2"]
    }
    Resume text:
    ${extractedText}

    please return in short summary in **strictly** in valid JSON format, without any additional text or formatting.
  `;

    // Send request to Gemini API
    const res = await model.generateContent([{ text: prompt }]);
    const responseText = await res.response.text();

    console.log("Raw AI Response:", responseText);

    // 🔥 Remove Markdown-style JSON formatting (` ```json ` and ` ``` `)
    const cleanedResponse = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse the cleaned JSON response
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Error extracting resume data:", error);
    return { error: "Failed to extract resume details. Please try again." };
  }
};
