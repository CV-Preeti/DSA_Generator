import { useState } from "react";
import { GeneratorForm } from "@/components/GeneratorForm";
import { QuestionCard } from "@/components/QuestionCard";
import { useGenerateQuestions, useDownloadPdf } from "@/hooks/use-questions";
import type { QuestionGeneratorInput, Question } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Download, BrainCircuit, Sparkles, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { mutate: generate, isPending: isGenerating } = useGenerateQuestions();
  const { mutate: downloadPdf, isPending: isDownloading } = useDownloadPdf();

  const handleGenerate = (data: QuestionGeneratorInput) => {
    generate(data, {
      onSuccess: (response) => {
        setQuestions(response.questions);
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pb-20">
      
      {/* Hero Header */}
      <div className="w-full bg-white dark:bg-slate-900 border-b border-border/50 shadow-sm sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600">
              DSA Generator
            </h1>
          </div>
          
          {questions.length > 0 && (
            <Button 
              onClick={() => downloadPdf(questions)}
              disabled={isDownloading}
              variant="outline"
              size="sm"
              className="hidden sm:flex"
            >
              {isDownloading ? (
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export PDF
            </Button>
          )}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Intro Section */}
        <div className="text-center mb-12 space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Master Your Next <br/>
            <span className="text-primary">Tech Interview</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Generate tailored Data Structures & Algorithms questions based on your target company and skill level. Practice smarter, not harder.
          </p>
        </div>

        {/* Generator Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-800 p-6 md:p-10 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <GeneratorForm onSubmit={handleGenerate} isPending={isGenerating} />
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {questions.length > 0 && (
            <motion.div 
              id="results-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-2xl font-bold">Generated Questions</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Found {questions.length} problems matching your criteria
                  </p>
                </div>
                
                {/* Mobile Download Button */}
                <Button 
                  onClick={() => downloadPdf(questions)}
                  disabled={isDownloading}
                  variant="outline"
                  size="sm"
                  className="sm:hidden"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {questions.map((q, index) => (
                  <QuestionCard key={q.id} question={q} index={index} />
                ))}
              </div>

              {/* Bottom Action Area */}
              <div className="flex justify-center pt-8 pb-12">
                <Button 
                  size="lg"
                  onClick={() => downloadPdf(questions)}
                  disabled={isDownloading}
                  className="px-8 h-12 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all text-base"
                >
                  {isDownloading ? (
                    <>Processing PDF...</>
                  ) : (
                    <>
                      <Download className="mr-2 h-5 w-5" />
                      Download Printable PDF
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Hint */}
        {questions.length === 0 && !isGenerating && (
          <div className="text-center py-20 opacity-40">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800 mb-4">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">Ready to generate your practice set</p>
          </div>
        )}
      </main>
    </div>
  );
}
