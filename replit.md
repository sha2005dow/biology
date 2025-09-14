# Space Biology Knowledge Engine

## Overview

This is a NASA research dashboard application designed to explore and analyze space biology publications, experiments, and AI-generated insights. The system provides a comprehensive interface for searching, filtering, and visualizing scientific research data related to biological experiments conducted in space environments. The application combines real-time data from NASA APIs with AI-powered analysis to deliver actionable insights for researchers and mission planners.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite for build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Type Safety**: Full TypeScript implementation across client and server
- **Development**: ESM modules with tsx for development hot-reloading
- **Build Process**: esbuild for server bundling, Vite for client bundling

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Fallback**: Memory-based storage implementation for development/testing

### API Design
- **RESTful Architecture**: Standard HTTP methods for CRUD operations
- **Endpoints**: Structured around publications, experiments, AI insights, and search functionality
- **Data Validation**: Zod schemas for runtime type validation shared between client and server
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Authentication and Authorization
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **Security**: Express middleware for request logging and error handling
- **Environment Variables**: Secure configuration management for API keys and database credentials

## External Dependencies

### Third-Party Services
- **NASA APIs**: Integration with NASA Technical Reports Server (NTRS) for publication data
- **OpenAI API**: GPT-5 model for AI-powered research insights, publication summarization, and search query enhancement
- **Neon Database**: Serverless PostgreSQL hosting for production deployment

### Development and Build Tools
- **Replit Integration**: Specialized plugins for development environment and error handling
- **Cartographer**: Development tooling for Replit environment
- **Font Loading**: Google Fonts integration for typography (Inter, JetBrains Mono)

### UI and Styling Dependencies
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Embla Carousel**: Touch-friendly carousel components
- **Class Variance Authority**: Utility for creating variant-based component APIs

### Data Processing
- **Date Handling**: date-fns for date manipulation and formatting
- **Form Management**: React Hook Form with Hookform Resolvers for form validation
- **Data Visualization**: Recharts for rendering charts and graphs in the knowledge dashboard

The system follows a modern full-stack TypeScript architecture with strong emphasis on type safety, developer experience, and scalable data management. The choice of Drizzle ORM provides excellent TypeScript integration while maintaining flexibility for complex queries needed for research data analysis.