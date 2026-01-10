import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionGeneratorSchema, dsaTopics, type Question, type QuestionGeneratorInput } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Printer, BookOpen } from "lucide-react";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuestionGeneratorInput>({
    resolver: zodResolver(questionGeneratorSchema),
    defaultValues: {
      topic: "Google",
      dsaTopic: "Arrays",
      questionCount: 1,
      difficulty: "Medium",
      detailed: false,
    },
  });

  const handleGenerateAndPrint = async (data: QuestionGeneratorInput) => {
    setIsGenerating(true);
    try {
      // 1. Generate Questions
      const genRes = await apiRequest("POST", "/api/questions/generate", data);
      const { questions: genQuestions } = await genRes.json();
      setQuestions(genQuestions);

      // 2. Generate PDF
      const pdfRes = await fetch("/api/questions/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: genQuestions }),
      });

      if (!pdfRes.ok) throw new Error("Failed to generate PDF");

      const blob = await pdfRes.blob();
      const url = URL.createObjectURL(blob);
      
      // Direct print approach: open in a new window and print immediately
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        // Most modern browsers will handle PDF printing automatically
        // or show the print preview immediately if the URL is a PDF blob
        toast({
          title: "Success",
          description: "Questionnaire generated successfully.",
        });
      } else {
        // Fallback for popup blockers
        const link = document.createElement('a');
        link.href = url;
        link.download = 'dsa-questions.pdf';
        link.click();
        toast({
          title: "Notice",
          description: "Popup was blocked. PDF downloaded instead.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-2 rounded-lg">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">DSA Question Generator</h1>
      </div>

      <Card className="mb-8 border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle>Configure Questionnaire</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateAndPrint)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Company/Context</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Google, Amazon" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dsaTopic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DSA Topic</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dsaTopics.map(topic => (
                          <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detailed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Detailed Problems</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Include input/output examples (like LeetCode)
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg shadow-md hover:shadow-lg transition-all" 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Printer className="mr-2 h-5 w-5" />
                      Generate & Print
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-semibold border-b pb-2">Generated Questions</h2>
          {questions.map((q) => (
            <Card key={q.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-4">
                <div className="space-y-1">
                  <CardTitle>{q.title}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{q.dsaTopic}</Badge>
                    <Badge variant="secondary">{q.difficulty}</Badge>
                    {q.companyTags.map(tag => (
                      <Badge key={tag} variant="ghost" className="bg-slate-100 dark:bg-slate-800">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{q.description}</p>
                {q.examples && q.examples.length > 0 && (
                  <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                    <h4 className="font-semibold text-xs uppercase tracking-widest text-muted-foreground">Examples</h4>
                    {q.examples.map((ex, idx) => (
                      <div key={idx} className="space-y-2 text-sm">
                        <div className="grid grid-cols-[80px_1fr] gap-2">
                          <span className="font-mono font-bold text-slate-500">Input:</span>
                          <code className="bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">{ex.input}</code>
                        </div>
                        <div className="grid grid-cols-[80px_1fr] gap-2">
                          <span className="font-mono font-bold text-slate-500">Output:</span>
                          <code className="bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">{ex.output}</code>
                        </div>
                        {ex.explanation && (
                          <div className="pl-2 border-l-2 border-primary/20 italic text-muted-foreground">
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
