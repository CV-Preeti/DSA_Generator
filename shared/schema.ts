import { z } from "zod";

export const difficultySchema = z.enum(["Easy", "Medium", "Hard"]);

export const questionGeneratorSchema = z.object({
  topic: z.string().min(1, "Company/Topic is required").default("Google"),
  dsaTopic: z.string().min(1, "DSA Topic is required").default("Arrays"),
  questionCount: z.number().min(1).max(20).default(1),
  difficulty: difficultySchema.default("Medium"),
  detailed: z.boolean().default(false),
});

export const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  difficulty: z.string(),
  companyTags: z.array(z.string()),
  dsaTopic: z.string().optional(),
  examples: z.array(z.object({
    input: z.string(),
    output: z.string(),
    explanation: z.string().optional()
  })).optional(),
});

export type QuestionGeneratorInput = z.infer<typeof questionGeneratorSchema>;
export type Question = z.infer<typeof questionSchema>;
