import { useMutation } from "@tanstack/react-query";
import { api, type QuestionGeneratorInput, type Question } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";

export function useGenerateQuestions() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: QuestionGeneratorInput) => {
      const res = await fetch(api.questions.generate.path, {
        method: api.questions.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to generate questions");
      }

      // Parse using the schema definition from api contract
      return api.questions.generate.responses[200].parse(await res.json());
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Something went wrong while generating questions.",
        variant: "destructive",
      });
    },
  });
}

export function useDownloadPdf() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (questions: Question[]) => {
      const res = await fetch(api.questions.downloadPdf.path, {
        method: api.questions.downloadPdf.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      return await res.blob();
    },
    onSuccess: (blob) => {
      // Trigger file download
      saveAs(blob, "dsa-questions.pdf");
      toast({
        title: "Download Started",
        description: "Your PDF is being downloaded.",
      });
    },
    onError: (error) => {
      toast({
        title: "Download Failed",
        description: error.message || "Could not generate PDF.",
        variant: "destructive",
      });
    },
  });
}
