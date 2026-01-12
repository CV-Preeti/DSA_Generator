# DSA Question Generator

## Overview

A web application that generates Data Structures and Algorithms (DSA) interview questions using AI. Users can specify a target company, DSA topic, difficulty level, and number of questions. The app generates relevant practice questions and allows downloading them as a PDF.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight router)
- **State Management**: TanStack React Query for server state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens (CSS variables for theming)
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod schemas for type-safe contracts
- **AI Integration**: OpenAI API (via Replit AI Integrations) for question generation
- **PDF Generation**: PDFKit for server-side PDF creation

### Data Storage
- **Current State**: In-memory storage (no database persistence required for session-based usage)
- **Database Ready**: Drizzle ORM configured with PostgreSQL dialect in `drizzle.config.ts`
- **Schema Location**: `shared/schema.ts` contains Zod schemas for validation and type definitions

### Shared Code
- **Location**: `shared/` directory contains code used by both frontend and backend
- **API Contracts**: `shared/routes.ts` defines API endpoints, methods, and request/response schemas
- **Schema**: `shared/schema.ts` contains validation schemas for questions, generator input, and DSA topics

### Build System
- **Development**: Vite dev server with HMR, Express backend via tsx
- **Production**: Custom build script using esbuild for server bundling, Vite for client

## External Dependencies

### AI Services
- **OpenAI API**: Used via Replit AI Integrations for generating DSA questions
  - Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Model: gpt-5.1 for text generation, gpt-image-1 for image generation (utility available)

### Database
- **PostgreSQL**: Configured but not actively used (in-memory storage currently)
  - Environment variable: `DATABASE_URL`
  - ORM: Drizzle with drizzle-kit for migrations

### PDF Generation
- **PDFKit**: Server-side PDF generation for downloadable question sheets

### Frontend Libraries
- **file-saver**: Client-side file download handling
- **date-fns**: Date formatting utilities

### Fonts
- Google Fonts: Inter (body text), Outfit (display/headers)