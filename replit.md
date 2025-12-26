# StarKids - Kids Entertainment Platform

## Overview

StarKids is a child-focused entertainment platform built with React and Express. It provides a safe, curated space for kids to access cartoons, games, music, and stories. The app includes a parent settings area protected by a simple math-based gate, allowing parents to customize content based on their child's behavioral needs (like managing tantrums, sharing difficulties, or sleep routines).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Context API via custom `AppProvider` in `lib/store.tsx` for global app state (user, child settings, playlist)
- **Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables for kid-friendly colors and rounded corners
- **Fonts**: Fredoka (headings) and Nunito (body) for playful, readable typography

### Backend Architecture
- **Framework**: Express.js running on Node with TypeScript
- **Server Setup**: HTTP server created separately to support future WebSocket integration
- **API Pattern**: RESTful routes prefixed with `/api` (defined in `server/routes.ts`)
- **Static Serving**: Production builds served from `dist/public` directory
- **Development**: Vite dev server with HMR integration for fast development

### Data Storage
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Location**: `shared/schema.ts` contains database table definitions
- **Current Storage**: In-memory storage implementation (`MemStorage` class) used as default, with interface ready for database swap
- **Migrations**: Drizzle Kit handles schema migrations, output to `./migrations` directory

### Key Design Decisions

**Shared Schema Between Frontend and Backend**
- The `shared/` directory contains types and schemas used by both client and server
- Zod schemas generated from Drizzle tables provide runtime validation
- Path alias `@shared/*` enables clean imports

**Child-Safe UI Design**
- Large touch targets and rounded corners for young users
- Parental gate uses simple math problems to restrict settings access
- Content filtering based on parent-selected behavioral tags

**PWA Support**
- Manifest file configured for installable web app
- Mobile-optimized viewport settings

## External Dependencies

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for PostgreSQL

### UI Libraries
- **Radix UI**: Full suite of accessible, unstyled component primitives
- **Tailwind CSS**: Utility-first CSS framework with custom theme
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Build Tools
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server-side bundling for production
- **TypeScript**: Type checking across the entire codebase

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tooling
- **@replit/vite-plugin-dev-banner**: Development environment indicator