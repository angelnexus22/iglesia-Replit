# Parish Management System (Sistema Parroquial)

## Overview

This is a parish management application built for Catholic parishes to manage their community, sacraments, groups, events, and volunteers. The system prioritizes accessibility, performance on basic devices, and a minimalist, utility-focused interface.

**Current connectivity status:** Web application requiring PostgreSQL database connection. **Offline-first features (PWA, USB backups, synchronization) are planned but not yet implemented** - see docs/PENDIENTES.md for roadmap.

The application serves as a comprehensive administrative tool for parish staff (priests, coordinators, volunteers) to maintain digital records of parishioners, sacramental history, pastoral groups, events, and volunteer coordination.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for development and production builds.

**UI Component System**: Utilizes shadcn/ui components (Radix UI primitives) with Tailwind CSS for styling. The design system follows Material Design principles adapted with a minimalist approach, optimized for users with varying technical literacy levels including elderly users and those on basic mobile devices.

**State Management**: 
- TanStack Query (React Query) v5 for server state management and caching
- Form state managed by React Hook Form with Zod schema validation
- No global client state management (relies on React Query cache)

**Routing**: wouter for lightweight client-side routing

**Design Philosophy**:
- Zero unnecessary animations for maximum performance
- System font stack to eliminate font loading overhead
- Clear information hierarchy over visual complexity
- Accessibility-first approach for universal usability

### Backend Architecture

**Server Framework**: Express.js running on Node.js

**API Design**: RESTful API with conventional HTTP methods (GET, POST, PATCH, DELETE) for CRUD operations

**Data Validation**: Zod schemas shared between client and server via the `/shared` directory for type safety and validation consistency

**Storage Layer**: PostgreSQL storage implementation using Drizzle ORM for all CRUD operations. Complete migration from in-memory storage to persistent database completed.

**Development Setup**: Vite middleware integration for hot module replacement in development, with separate build process for production deployment

### Data Storage Solutions

**ORM**: Drizzle ORM configured for PostgreSQL databases

**Database Provider**: Neon serverless PostgreSQL (@neondatabase/serverless)

**Schema Management**: 
- Schema definitions in `shared/schema.ts` using Drizzle's PostgreSQL table builders
- Drizzle Kit for migrations (configured in `drizzle.config.ts`)
- Zod schemas automatically generated from Drizzle schemas using `drizzle-zod`

**Data Models**:
- **Users**: Authentication and role-based access (parish priest, coordinator, volunteer)
- **Feligreses** (Parishioners): Core member directory with contact info, family relationships, and sacramental status
- **Sacramentos** (Sacraments): Historical records of baptisms, first communions, confirmations, and marriages
- **Grupos** (Groups): Pastoral groups and ministries management
- **MiembroGrupo**: Many-to-many relationship between parishioners and groups
- **Eventos** (Events): Parish calendar and event management
- **Voluntarios** (Volunteers): Event volunteer coordination
- **CategoriasFinancieras** (Financial Categories): Income and expense categories for accounting
- **Transacciones** (Transactions): Financial transactions with payment methods and references
- **ArticulosInventario** (Inventory Items): Liturgical supplies, office materials, furniture tracking
- **MovimientosInventario** (Inventory Movements): Entry/exit movements with automatic stock updates
- **Prestamos** (Loans): Item loans to parishioners with scheduled return dates

**Offline-First Considerations**: 
- **Current state:** Application requires internet connection to PostgreSQL database
- **Planned (not implemented):** Architecture will support PWA with service workers, IndexedDB local storage, and eventual synchronization
- **See docs/PENDIENTES.md** for detailed offline roadmap (USB backups, sync between parishes, conflict resolution)

**Recent Implementations**:
- ✅ PostgreSQL database with Drizzle ORM (November 2025)
- ✅ PDF certificate generation with PDFKit for all sacrament types (November 2025)
- ✅ Production-ready authentication system with express-session and connect-pg-simple (November 2025)
- ✅ Financial and inventory modules complete (Phases 2-3, November 2025)
- ✅ Dashboard financiero with Recharts visualizations (November 2025)
- ✅ CSV export system with UTF-8 BOM support (November 2025)
- ✅ Complete seed data with 19 transactions, 17 inventory items, 4 loans (November 2025)
- ✅ Bug fix: Stock auto-update in inventory movements (November 10, 2025)

### Authentication and Authorization

**Implementation Status**: ✅ **Production-ready authentication system fully implemented**

**Security Features**:
- Session-based authentication with express-session and connect-pg-simple for PostgreSQL session storage
- Password hashing with bcrypt (10 salt rounds)
- Environment-based SESSION_SECRET (required for server startup)
- Secure cookie configuration (httpOnly, sameSite: "lax", 24-hour maxAge)
- Automatic session table creation in PostgreSQL
- Session persistence across server restarts
- Proper cookie cleanup on logout

**Endpoints**:
- POST /api/auth/register - User registration with password hashing
- POST /api/auth/login - Login with Zod-validated credentials
- POST /api/auth/logout - Session destruction and cookie cleanup
- GET /api/auth/me - Current user session retrieval

**Frontend Protection**:
- ProtectedRoute component with wouter-based redirects
- useAuth hook with conditional query execution to avoid unnecessary 401s on /login
- Automatic redirect to /login for unauthenticated access
- User info display in header (name, role, logout button)

**Role-Based Access Control**:
- Three roles: parroco (parish priest), coordinador (coordinator), voluntario (volunteer)
- Middleware functions available: requireAuth, requireRole
- Role validation stored in session for fast access
- Ready for endpoint-level permission enforcement

**Testing**: All authentication flows tested and verified end-to-end including register, login, protected routes, logout, and security measures.

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives for accessible, unstyled component primitives
- Tailwind CSS for utility-first styling
- class-variance-authority (CVA) for component variant management
- clsx and tailwind-merge for conditional class composition

**Form Handling**:
- React Hook Form for performant form state management
- @hookform/resolvers for Zod schema integration

**Data Fetching & Caching**:
- TanStack Query v5 for server state management

**Date Handling**:
- date-fns for date formatting and manipulation

**Development Tools**:
- TypeScript for type safety across the stack
- Vite with HMR for fast development experience
- ESBuild for production server bundling
- Replit-specific plugins for development environment integration

**Database & ORM**:
- Drizzle ORM for type-safe database operations
- Neon serverless PostgreSQL for cloud database hosting
- drizzle-zod for automatic Zod schema generation from database schemas

**Additional UI Components**:
- cmdk for command palette functionality
- embla-carousel-react for carousel components
- lucide-react for iconography

**Key Architectural Decisions**:

1. **Monorepo Structure**: Client, server, and shared code in a single repository with path aliases for clean imports
2. **Shared Type Safety**: Database schemas, Zod validators, and TypeScript types shared between frontend and backend via the `/shared` directory
3. **Future Offline-First Design**: Architecture prepared to support working without internet connectivity (planned: PWA, service workers, IndexedDB, USB backups - see docs/PENDIENTES.md)
4. **Production-Ready Authentication**: Session-based authentication with role-based access control (parroco, coordinador, voluntario) and secure password management
5. **Spanish Language**: All UI text, comments, and documentation in Spanish to match the target user base
6. **Performance Priority**: Minimal dependencies, no custom fonts, system-level design choices optimized for low-end devices

## Project Documentation

**Comprehensive documentation is available in the `/docs` folder:**

- **[README.md](./docs/README.md)** - Project overview, quick start, and feature summary
- **[ESTADO-ACTUAL.md](./docs/ESTADO-ACTUAL.md)** - Complete status of all implemented features (Phases 1-3)
- **[PENDIENTES.md](./docs/PENDIENTES.md)** - Roadmap of pending features and future enhancements
- **[GUIA-DESARROLLO.md](./docs/GUIA-DESARROLLO.md)** - Developer setup guide, conventions, and troubleshooting
- **[ARQUITECTURA.md](./docs/ARQUITECTURA.md)** - Technical architecture, design patterns, and decisions
- **[API-ENDPOINTS.md](./docs/API-ENDPOINTS.md)** - Complete REST API documentation with examples

**For new developers joining the project:**
Start with [docs/README.md](./docs/README.md) for an overview, then read [docs/GUIA-DESARROLLO.md](./docs/GUIA-DESARROLLO.md) to set up your environment.

**Latest Updates (November 10, 2025)**:
- Complete financial accounting system with 11 categories and transaction management
- Inventory control with automatic stock updates on movements
- Dashboard financiero with interactive charts (bar, pie, line graphs)
- CSV export functionality for transactions, reports, and inventory
- Comprehensive seed data for demonstration (70+ records across 12 tables)
- Bug fix: POST /api/movimientos-inventario now correctly updates article stock