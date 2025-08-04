# Trading Platform

## Overview

This is a modern trading platform web application built with React and Express. The platform provides a comprehensive trading interface with features including portfolio management, order execution, market data visualization, technical analysis tools, and paper trading capabilities. The application uses a dark theme optimized for financial trading environments with specialized color schemes for profit/loss indicators and trading actions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom trading-specific design tokens and dark theme optimization
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation schemas
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Development**: tsx for TypeScript execution during development
- **Session Management**: Express sessions with PostgreSQL store via connect-pg-simple
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development and database implementation for production

### Data Storage Solutions
- **Database**: PostgreSQL configured via Neon Database serverless driver
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Management**: Shared schema definitions between frontend and backend
- **Validation**: Drizzle-zod integration for runtime type validation
- **Migrations**: Drizzle Kit for database schema migrations

### Authentication and Authorization
- **Session-based Authentication**: Express sessions with PostgreSQL session store
- **User Management**: Basic user model with username/password authentication
- **Route Protection**: Planned implementation for authenticated routes

### Trading-Specific Features
- **Market Data**: Real-time market data display and charting capabilities
- **Order Management**: Buy/sell order execution with different order types (market, limit)
- **Portfolio Tracking**: Holdings management with profit/loss calculations
- **Technical Analysis**: Chart visualization with indicator support
- **Paper Trading**: Virtual trading environment for strategy testing
- **Risk Management**: Position sizing and risk controls

### UI/UX Design Decisions
- **Trading-Optimized Theme**: Dark color scheme with specialized colors for buy (green), sell (red), and neutral (yellow) actions
- **Responsive Layout**: Sidebar navigation with collapsible design for mobile and desktop
- **Real-time Updates**: Market status indicators and live price feeds
- **Professional Interface**: Clean, data-dense layout optimized for trading workflows

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form for form management
- **Routing**: Wouter for lightweight routing solution
- **State Management**: TanStack React Query for server state and caching
- **TypeScript**: Full TypeScript support across frontend and backend

### UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting

### Backend Infrastructure
- **Server Framework**: Express.js with TypeScript support
- **Database**: PostgreSQL via Neon Database serverless platform
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage

### Development Tools
- **Build System**: Vite with React plugin for fast development
- **TypeScript**: Comprehensive type checking and modern JavaScript features
- **Development Server**: tsx for TypeScript execution
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Replit Integration**: Specialized plugins for Replit development environment

### Validation and Utilities
- **Schema Validation**: Zod for runtime type validation
- **Class Utilities**: clsx and class-variance-authority for conditional styling
- **Utility Functions**: tailwind-merge for Tailwind class optimization

### Planned Integrations
- **Market Data APIs**: Real-time financial data providers
- **Trading APIs**: Brokerage integrations for live trading
- **Authentication Services**: OAuth providers for user authentication
- **Analytics Services**: Trading performance and risk analytics