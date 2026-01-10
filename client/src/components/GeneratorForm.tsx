import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionGeneratorSchema, type QuestionGeneratorInput } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GeneratorFormProps {
  onSubmit: (data: QuestionGeneratorInput) => void;
  isPending: boolean;
}

export function GeneratorForm({ onSubmit, isPending }: GeneratorFormProps) {
  const form = useForm<QuestionGeneratorInput>({
    resolver: zodResolver(questionGeneratorSchema),
    defaultValues: {
      topic: "Google",
      questionCount: 5,
      difficulty: "Medium",
    },
  });

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Topic Input */}
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel className="text-base font-semibold text-foreground/80">Target Company or Topic</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Google, Amazon, Dynamic Programming..." 
                        className="h-12 text-lg bg-background/50 border-2 focus:border-primary/50 transition-all rounded-xl"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Difficulty Select */}
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold text-foreground/80">Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-background/50 border-2 focus:border-primary/50 rounded-xl">
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

              {/* Question Count Slider */}
              <FormField
                control={form.control}
                name="questionCount"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center mb-2">
                      <FormLabel className="text-base font-semibold text-foreground/80">
                        Number of Questions
                      </FormLabel>
                      <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-md min-w-[32px] text-center">
                        {field.value}
                      </span>
                    </div>
                    <FormControl>
                      <div className="py-2">
                        <Slider
                          min={1}
                          max={20}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-4"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Interview Prep...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Questions
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
