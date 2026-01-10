import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { generateQuestions } from "./lib/openai";
import { generateQuestionsPDF } from "./lib/pdf";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.questions.generate.path, async (req, res) => {
    try {
      const input = api.questions.generate.input.parse(req.body);
      const questions = await generateQuestions(input);
      res.json({ questions });
    } catch (error) {
      console.error("Error generating questions:", error);
      res.status(500).json({ message: "Failed to generate questions" });
    }
  });

  app.post(api.questions.downloadPdf.path, async (req, res) => {
    try {
      const input = api.questions.downloadPdf.input.parse(req.body);
      const pdfBuffer = await generateQuestionsPDF(input.questions);
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=dsa-questions.pdf");
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  return httpServer;
}
