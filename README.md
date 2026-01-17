I'll explain the architecture and functionality of the DSA Question Generator.

High-Level Architecture
The application follows a modern full-stack architecture with a React frontend and a Node.js/Express backend, communicating via a type-safe REST API.

1. Frontend (Client-Side)
Framework: React with TypeScript.
State & Data Fetching:
TanStack Query (React Query): Manages server-side state and API interactions.
React Hook Form + Zod: Handles the questionnaire configuration form with real-time validation.
UI/UX:
Shadcn/UI: Provides the accessible components (Cards, Buttons, Selects, Inputs).
Tailwind CSS: Used for responsive styling and dark mode support.
Lucide React: Icon library for visual cues.
Framer Motion: Handles smooth entry animations for generated questions.

2. Backend (Server-Side)
Runtime: Node.js with Express.
API Layer: Defines endpoints for question generation and document processing.
AI Engine: Integrates with OpenAI (via Replit's native AI integration) to generate context-aware questions.
Document Generation: Uses PDFKit to transform the generated JSON questions into a professionally formatted PDF for offline practice.

3. API Endpoints & Functionality

A. POST /api/questions/generate
This is the core functional API.

Inputs: Company name, DSA topic (e.g., Arrays, DP), difficulty level, and whether detailed examples are needed.
Action: It constructs a sophisticated prompt for the AI. I've designed this prompt to ensure the output includes:
A clear problem statement.
Company-specific context.
I have detailed input/output examples (if you'd like).
Practice Link: The AI identifies the official problem URL on platforms like LeetCode or GeeksforGeeks so you can code the solution immediately.

Response: A JSON list of validated question objects.
B. POST /api/questions/pdf
Handles the "Print" functionality.

Inputs: The list of generated questions.
Action: The server uses PDFKit to draw a clean, printable document. It includes headers, topic badges, and the full description of each problem.

Response: A PDF binary stream.
Frontend Logic: When the PDF is ready, the app automatically triggers the browser's native print preview using a hidden iframe, so you don't have to click "Print" manually.
4. Shared Logic & Schema
shared/schema.ts: This is the "Source of Truth." It contains the Zod definitions used by both the frontend (for form validation) and the backend (for AI prompt engineering and API responses). This ensures that if a question has a "Practice URL," both sides of the app know exactly how to handle it.
Summary of Every Functionality
Selection: Choose your target (e.g., Google) and topic (e.g., Graphs).
Generation: AI pulls relevant, company-tagged questions with direct practice links.
Visualisation: Questions appear with badges for difficulty and topic.
Auto-Print: One click generates the questions and immediately opens your system's print dialog with a formatted worksheet.
Practice: Click "Practice Here" to go directly to the coding platform for that specific problem.
