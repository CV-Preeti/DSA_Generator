const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const { company, topic, difficulty, count } = await req.json();
    const n = Math.min(Math.max(parseInt(count) || 5, 1), 20);
    if (!company || typeof company !== "string" || company.length > 60) return json({ error: "Invalid company" }, 400);
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) return json({ error: "AI key missing" }, 500);

    const prompt = `List ${n} real DSA interview questions frequently asked at ${company}${topic && topic !== "Any" ? ` on the topic ${topic}` : ""}, difficulty: ${difficulty || "Mixed"}. Prefer well-known LeetCode / GeeksforGeeks problems and give the real practice URL.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an expert coding interview coach. Return accurate, real problems." },
          { role: "user", content: prompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_questions",
            parameters: {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
                      topic: { type: "string" },
                      description: { type: "string", description: "Full problem statement, 2-5 sentences" },
                      example: { type: "string", description: "Input / Output example" },
                      hint: { type: "string" },
                      url: { type: "string" },
                    },
                    required: ["title", "difficulty", "topic", "description", "example", "hint", "url"],
                  },
                },
              },
              required: ["questions"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_questions" } },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      console.error("AI error", res.status, t);
      if (res.status === 429) return json({ error: "Too many requests, try again shortly." }, 429);
      if (res.status === 402) return json({ error: "AI credits exhausted." }, 402);
      return json({ error: "AI request failed", details: t }, 500);
    }
    const data = await res.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = JSON.parse(args ?? "{}");
    return json({ questions: parsed.questions ?? [] });
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
