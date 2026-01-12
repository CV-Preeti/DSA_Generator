import OpenAI from "openai";
import { Question, QuestionGeneratorInput } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function generateQuestions(input: QuestionGeneratorInput): Promise<Question[]> {
  const prompt = `Generate ${input.questionCount} Data Structures and Algorithms (DSA) questions.
  Target Company/Topic: ${input.topic}
  DSA Topic: ${input.dsaTopic}
  Difficulty: ${input.difficulty}
  Detailed: ${input.detailed ? "Yes (include input/output examples)" : "No"}

  Return a JSON object with a "questions" array.
  Each question should have:
  - id: number (1 to ${input.questionCount})
  - title: string
  - description: string (brief problem statement)
  - difficulty: string (Easy, Medium, or Hard)
  - companyTags: array of strings (relevant companies, include ${input.topic})
  - practiceUrl: string (A valid URL to practice this question on a platform like LeetCode, GeeksforGeeks, or HackerRank. If not found, provide a search query link on Google for the question title)
  - dsaTopic: string (the specific DSA topic like ${input.dsaTopic})
  ${input.detailed ? "- examples: array of objects with { input: string, output: string, explanation: string }" : ""}

  Ensure the questions are relevant to both the target company and the DSA topic.
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
