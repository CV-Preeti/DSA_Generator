import OpenAI from "openai";
import { Question, QuestionGeneratorInput } from "@shared/schema";

// the integration sets these env vars
const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateQuestions(input: QuestionGeneratorInput): Promise<Question[]> {
  const prompt = `Generate ${input.questionCount} Data Structures and Algorithms (DSA) questions.
  Target Company/Topic: ${input.topic}
  Difficulty: ${input.difficulty}

  Return a JSON object with a "questions" array.
  Each question should have:
  - id: number (1 to ${input.questionCount})
  - title: string
  - description: string (brief problem statement)
  - difficulty: string (Easy, Medium, or Hard)
  - companyTags: array of strings (relevant companies, include ${input.topic})

  Ensure the questions are relevant to the topic/company.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-5.1",
    messages: [
      { role: "system", content: "You are a helpful assistant that generates DSA interview questions in JSON format." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Failed to generate questions");
  }

  const result = JSON.parse(content);
  return result.questions;
}
