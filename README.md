# DSA Generator

Generate company-targeted DSA (Data Structures & Algorithms) practice sheets and print them as a PDF.

**Live app:** https://dsa-drill-generator.lovable.app
**Repository:** https://github.com/CV-Preeti/DSA_Generator

## What it does

Pick a target company, a topic, a difficulty level and how many questions you want (1–20). The app returns real interview-style problems for that company — each with a title, difficulty, topic, full problem statement, an input/output example, a hint and a link to the practice page — and lays them out as a print-ready sheet.

**Print / Save as PDF** opens the browser's own print window with the form and buttons hidden, so the question list prints clean. Choose "Save as PDF" as the destination to keep a copy.

## How it works

1. The React form collects `company`, `topic`, `difficulty` and `count`, and calls the `generate-questions` backend function.
2. The backend function builds a prompt and calls the AI gateway with a structured tool call, so the reply always arrives as typed JSON: `title`, `difficulty`, `topic`, `description`, `example`, `hint`, `url`.
3. The response is validated and rendered as an ordered list of question cards. Invalid or empty requests return a clear error message instead of a broken page.

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18, Vite 5, TypeScript 5, Tailwind CSS, shadcn/ui |
| Backend | Supabase Edge Function (`generate-questions`) on Lovable Cloud |
| AI | Lovable AI Gateway — `google/gemini-3-flash-preview` with a forced function call |
| Hosting | Lovable hosting (SPA fallback built in, HTTPS automatic) |

## Project structure

```text
.
├── index.html                      # page shell, title and social metadata
├── src/
│   ├── App.tsx                     # router
│   ├── pages/Index.tsx             # the generator form + printable question sheet
│   ├── pages/NotFound.tsx
│   ├── components/                 # shadcn/ui components
│   ├── hooks/                      # use-mobile, use-toast
│   ├── integrations/supabase/      # generated client (do not edit by hand)
│   └── index.css                   # design tokens and print styles
├── supabase/functions/
│   ├── generate-questions/         # the question generator
│   └── _shared/cron-auth.ts
├── drizzle/                        # database migrations
├── tailwind.config.ts
└── vite.config.ts
```

## Running locally

Requires Node.js 18+.

```sh
npm install
npm run dev
```

Then open the URL Vite prints (http://localhost:8080 by default).

## Backend notes

- `supabase/functions/generate-questions/index.ts` is the only backend endpoint. It reads `LOVABLE_API_KEY` from the environment, so the AI key never reaches the browser.
- Input is validated server-side: `count` is clamped to 1–20, `company` must be a string of at most 60 characters.
- Rate limits (429), exhausted credits (402) and upstream failures are returned as readable JSON errors, which the UI shows as a toast.
- The original brief asked for a Java backend. Java cannot run on this hosting platform, so the equivalent endpoint is implemented as an Edge Function. The `client`/`server` code from earlier revisions of this repository has been replaced by this structure.

## Deploying

The app is published at https://dsa-drill-generator.lovable.app. Frontend changes need a republish from the editor; backend function changes deploy as soon as they are pushed.

## Ideas to extend

- Persist generated sheets per user and let them revisit or re-download old sets.
- Filter by difficulty mix (for example 60% medium, 40% hard) instead of one level.
- Export to a real PDF on the server, and add a topic-wise syllabus checklist.
- Track solved status and spaced repetition for questions you keep getting wrong.
