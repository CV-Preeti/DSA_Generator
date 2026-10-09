import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Printer, Sparkles, ExternalLink } from "lucide-react";

type Q = { title: string; difficulty: string; topic: string; description: string; example: string; hint: string; url: string };
const TOPICS = ["Any", "Arrays", "Strings", "Linked List", "Trees", "Graphs", "Dynamic Programming", "Greedy", "Binary Search", "Stack & Queue", "Heap", "Backtracking"];

const Index = () => {
  const [company, setCompany] = useState("Google");
  const [topic, setTopic] = useState("Any");
  const [difficulty, setDifficulty] = useState("Mixed");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Q[]>([]);

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("generate-questions", { body: { company, topic, difficulty, count } });
    setLoading(false);
    if (error || data?.error) return toast.error(data?.error || "Could not generate questions. Try again.");
    setQuestions(data.questions);
    if (!data.questions.length) toast.info("No questions found, try other options.");
  };

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-4xl px-6 py-12 print:hidden">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">DSA Generator</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">Company-targeted DSA practice sheets</h1>
        <p className="mt-3 text-lg text-muted-foreground">Pick a company, topic and difficulty. Get real interview questions and print them as a PDF.</p>

        <form onSubmit={generate} className="mt-8 grid gap-4 rounded-xl border bg-card p-6 shadow-sm md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company">Target company</Label>
            <Input id="company" value={company} maxLength={60} required onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="count">Number of questions (1–20)</Label>
            <Input id="count" type="number" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TOPICS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Mixed", "Easy", "Medium", "Hard"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 md:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate questions
            </Button>
            {questions.length > 0 && (
              <Button type="button" variant="outline" onClick={() => window.print()}>
                <Printer /> Print / Save as PDF
              </Button>
            )}
          </div>
        </form>
      </section>

      {questions.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 pb-16">
          <h2 className="mb-1 text-2xl font-bold">{company} — {topic === "Any" ? "All topics" : topic} ({difficulty})</h2>
          <p className="mb-6 text-sm text-muted-foreground">{questions.length} questions</p>
          <ol className="space-y-5">
            {questions.map((q, i) => (
              <li key={i} className="break-inside-avoid rounded-xl border bg-card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{i + 1}. {q.title}</h3>
                  <Badge>{q.difficulty}</Badge>
                  <Badge variant="secondary">{q.topic}</Badge>
                </div>
                <p className="mt-3">{q.description}</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">{q.example}</pre>
                <p className="mt-3 text-sm text-muted-foreground"><strong>Hint:</strong> {q.hint}</p>
                <a href={q.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline">
                  {q.url} <ExternalLink className="h-3 w-3 print:hidden" />
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
};

export default Index;
