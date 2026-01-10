import { z } from "zod";
import { questionGeneratorSchema, questionSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  questions: {
    generate: {
      method: "POST" as const,
      path: "/api/questions/generate",
      input: questionGeneratorSchema,
      responses: {
        200: z.object({ questions: z.array(questionSchema) }),
        500: errorSchemas.internal,
      },
    },
    downloadPdf: {
      method: "POST" as const,
      path: "/api/questions/pdf",
      input: z.object({ questions: z.array(questionSchema) }),
      responses: {
        200: z.any(), // Blob/Stream
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
