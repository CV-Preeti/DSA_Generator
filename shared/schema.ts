import { z } from "zod";

export const difficultySchema = z.enum(["Easy", "Medium", "Hard"]);

export const questionGeneratorSchema = z.object({
  topic: z.string().min(1, "Company/Topic is required").default("Google"),
  questionCount: z.number().min(1).max(20).default(5),
  difficulty: difficultySchema.default("Medium"),
});

export const questionSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  difficulty: z.string(),
  companyTags: z.array(z.string()),
});

export type QuestionGeneratorInput = z.infer<typeof questionGeneratorSchema>;
export type Question = z.infer<typeof questionSchema>;
