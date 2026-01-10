import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Question } from "@shared/routes";
import { Building2, SignalHigh, SignalLow, SignalMedium } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  index: number;
}

export function QuestionCard({ question, index }: QuestionCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200";
      case "hard":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 hover:bg-rose-200";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return <SignalLow className="w-3.5 h-3.5 mr-1" />;
      case "medium":
        return <SignalMedium className="w-3.5 h-3.5 mr-1" />;
      case "hard":
        return <SignalHigh className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="h-full border-border/60 hover:shadow-lg hover:border-primary/50 transition-all duration-300 group overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1.5">
              <Badge 
                variant="secondary" 
                className={`transition-colors duration-300 ${getDifficultyColor(question.difficulty)}`}
              >
                {getDifficultyIcon(question.difficulty)}
                {question.difficulty}
              </Badge>
              <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                {question.title}
              </CardTitle>
            </div>
            <span className="text-xs font-mono text-muted-foreground/60">#{question.id}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
              {question.description}
            </p>
            
            <div className="pt-2 flex flex-wrap gap-2">
              {question.companyTags.map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="text-xs font-normal border-primary/20 text-primary/80 bg-primary/5 group-hover:bg-primary/10 transition-colors"
                >
                  <Building2 className="w-3 h-3 mr-1 opacity-70" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
