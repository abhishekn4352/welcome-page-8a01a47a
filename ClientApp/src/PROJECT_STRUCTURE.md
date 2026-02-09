# Project Structure Overview

This is an **industry-level React + TypeScript application** with a professional folder structure following best practices. The project is organized for scalability, maintainability, and team collaboration.

## Directory Structure

```
ClientApp/src/
├── components/              # Reusable UI components
│   ├── index.ts            # Component exports barrel file
│   ├── layout/             # Layout wrapper components
│   │   ├── AdminLayout.tsx
│   │   ├── MainLayout.tsx
│   │   └── index.ts
│   ├── reportrunner/       # Report runner domain components
│   │   ├── AdhocParameterBuilder.tsx
│   │   ├── DateRangeSelector.tsx
│   │   ├── DynamicParameterForm.tsx
│   │   └── index.ts
│   ├── settings/           # Settings feature components
│   │   ├── API.tsx
│   │   ├── CommunityNodes.tsx
│   │   ├── Environments.tsx
│   │   ├── (other settings)
│   │   └── index.ts
│   ├── ui/                 # Reusable base UI components (Button, Card, etc.)
│   │   ├── accordion.tsx
│   │   ├── alert.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── (other UI components)
│   │   └── index.ts       # Centralized UI exports
│   └── BackendTestPanel.tsx
│
├── modules/                 # Feature modules (self-contained features)
│   ├── index.ts
│   ├── auth/               # Authentication module
│   │   ├── index.ts
│   │   └── login/
│   │       └── Login.tsx
│   ├── dashboard/          # Dashboard feature module
│   │   ├── index.ts
│   │   ├── canvas/         # Canvas visualization
│   │   │   ├── EnhancedCanvas.jsx
│   │   │   ├── components/
│   │   │   ├── context/
│   │   │   ├── utils/
│   │   │   └── index.js
│   │   ├── charts/         # Chart components
│   │   │   ├── AreaChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── (other charts)
│   │   │   └── index.js
│   │   ├── editor/         # Dashboard editor
│   │   │   ├── DashboardEditor.tsx
│   │   │   ├── useDashboardEditor.ts
│   │   │   ├── components/
│   │   │   └── index.ts
│   │   ├── list/           # Dashboard list view
│   │   │   ├── DashboardList.tsx
│   │   │   ├── useDashboardList.ts
│   │   │   └── index.ts
│   │   ├── viewer/         # Dashboard viewer
│   │   │   ├── DashboardViewer.tsx
│   │   │   ├── useDashboardViewer.ts
│   │   │   └── index.ts
│   │   ├── services/       # Dashboard-specific services
│   │   │   ├── dashboard.service.ts
│   │   │   └── index.ts
│   │   └── types/          # Dashboard type definitions
│   │       └── index.ts
│   └── dynamicform/        # Dynamic form module
│       ├── index.ts
│       ├── DynamicFormList.tsx
│       ├── DynamicFormViewer.tsx
│       └── components/
│           ├── DynamicFormBuilder.tsx
│           └── index.ts
│
├── pages/                   # Page-level components (one per route)
│   ├── index.ts
│   ├── ChartShowcase.tsx
│   ├── Dashboard.tsx
│   ├── DashboardHome.tsx
│   ├── InvestigateRunnerList.tsx
│   ├── InvestigateRunnerView.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── OAuthCallback.tsx
│   ├── OAuthComplete.tsx
│   ├── Privacy.tsx
│   ├── ProcessedDataPage.tsx
│   ├── ProfilePage.tsx
│   ├── ReportRunnerList.tsx
│   ├── ReportRunnerView.tsx
│   ├── ResetPassword.tsx
│   ├── Terms.tsx
│   ├── TrackerRunnerList.tsx
│   ├── TrackerRunnerView.tsx
│   └── dashboard/
│
├── routes/                  # Route definitions
│   ├── index.ts
│   └── ProtectedRoute.tsx
│
├── services/                # API and data services (layer between UI and API)
│   ├── index.ts
│   ├── api.ts              # Base API client
│   ├── dynamicFormService.ts
│   ├── investigateRunnerService.ts
│   ├── processedDataService.ts
│   ├── reportRunnerService.ts
│   └── trackerRunnerService.ts
│
├── hooks/                   # Custom React hooks
│   ├── index.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
│
├── lib/                     # Shared libraries and utilities
│   ├── index.ts
│   ├── constants.ts         # Application-wide constants
│   └── utils.ts             # General utilities
│
├── utils/                   # Domain-specific utilities
│   ├── index.ts
│   ├── dateUtils.ts         # Date/time utilities
│   └── reportQueryBuilder.ts # Report query utilities
│
├── theme/                   # Theme and styling configuration
│   ├── index.ts
│   ├── ThemeProvider.tsx
│   ├── muiTheme.ts
│   └── muiTheme.tsx
│
├── styles/                  # Global and feature-specific styles
│   └── settings.css
│
├── mock/                    # Mock data for development/testing
│   ├── nodeLibrary.js
│   └── workflows.js
│
├── public/                  # Static assets
│   ├── dhws-error-tracker.js
│   ├── dhws-web-inspector.js
│   └── robots.txt
│
├── App.css
├── App.tsx                  # Main application component
├── config.ts                # Environment configuration
├── index.css                # Global CSS
├── main.tsx                 # Application entry point
└── vite-env.d.ts            # Vite TypeScript definitions
```

## Naming Conventions

### Components
- **PascalCase** for React components
- Example: `AdminLayout.tsx`, `DateRangeSelector.tsx`

### Services & Utilities
- **camelCase** for service and utility files
- Example: `reportRunnerService.ts`, `dateUtils.ts`

### Hooks
- **kebab-case** (lowercase with hyphens) for custom hooks
- Example: `use-toast.ts`, `use-mobile.tsx`

### Constants
- **UPPER_SNAKE_CASE** for constants
- Example: `API_BASE_URL`, `MAX_RECORDS_PER_PAGE`

### Types & Interfaces
- **PascalCase** for types, interfaces, and classes
- Example: `ReportRecord`, `AdminLayoutProps`, `DashboardService`

## Key Principles

### 1. **Module Organization**
- Each feature is a self-contained module in `/modules`
- Modules have their own components, services, types, and utilities
- **Report Runner, Tracker Runner, Investigate Runner, and Processed Data are now complete modules**
- All related files are grouped together (pages, components, services, utils)
- Promotes encapsulation and reduces cross-cutting dependencies

### 2. **Component Hierarchy**
- `components/` - Reusable, generic UI components (layout, settings, ui)
- `modules/*/components/` - Feature-specific components
- `modules/*/pages/` - Feature-specific pages
- `pages/` - General application pages (auth, profile, static pages)

### 3. **Service Layer**
- `services/` - Global API client and shared services
- `modules/*/services/` - Feature-specific services (each runner has its own)
- Services handle data fetching, transformation, and business logic
- Each module owns its service layer

### 4. **Barrel Exports (Index Files)**
- Each folder has an `index.ts` for clean imports
- Allows importing from `@/components` instead of `@/components/Button`
- Makes refactoring easier and reduces import changes when moving files

### 5. **Type Safety**
- All code is TypeScript
- Types are shipped with their respective modules
- Shared types are in the service or module that defines them

### 6. **Lazy Loading**
- Pages are lazy-loaded in `App.tsx` for better performance
- Only critical pages are loaded on app start

## Import Examples

### ❌ Avoid (Deep imports)
```typescript
import Button from '../../components/ui/button/button';
import { api } from '../../../services/api';
import { AdminLayout } from '../../../../components/layout/AdminLayout';
```

### ✅ Preferred (Using barrel exports)
```typescript
import { Button } from '@/components';
import { api } from '@/services';
import { AdminLayout } from '@/components';
```

### ✅ Breaking up UI imports (when needed)
```typescript
import { 
  Button, 
  Card, 
  Dialog, 
  Table 
} from '@/components/ui';
```

### ✅ Feature-specific imports
// Report Runner
import { ReportRunnerList, ReportRunnerView, reportRunnerService } from '@/modules/reportrunner';

// Tracker Runner
import { TrackerRunnerList, trackerRunnerService } from '@/modules/trackerrunner';

// Investigate Runner
import { InvestigateRunnerList } from '@/modules/investigaterunner';

// Processed Data
import { ProcessedDataPage, processedDataService } from '@/modules/processeddata';

// Dashboard
```typescript
import { DashboardList, DashboardEditor } from '@/modules/dashboard';
import { Login } from '@/modules/auth';
```

## File Size Guidelines

- **Components**: Keep under 300 lines (consider splitting if larger)
- **Services**: Keep under 400 lines (split by feature domain)
- **Pages**: Can be larger, but extract complex logic to components/services
- **Utilities**: Keep focused (one concern per utility module)

## Adding New Features

### Step 1: Create Module Structure
```
src/modules/newfeature/
├── index.ts
├── components/
│   ├── .../Component.tsx
│   └── index.ts
├── services/
│   ├── newfeature.service.ts
│   └── index.ts
├── types/
│   ├── index.ts
│   └── [optional type definitions]
└── [Feature Main Component].tsx
```

### Step 2: Create Barrel Exports (index.ts)
```typescript
// src/modules/newfeature/index.ts
export * from './services';
export * from './types';
export { default as FeatureComponent } from './FeatureComponent';
```

### Step 3: Add to Routes
Update `src/App.tsx` to import and route to your feature module.

### Step 4: Use Consistent Patterns
- Follow existing service patterns for API calls
- Follow existing component patterns for UI
- Keep types with their respective modules

## Best Practices

### Do's ✅
- ✅ Import from barrel files (`@/services`, `@/components`)
- ✅ Keep components focused and single-responsibility
- ✅ Extract complex logic to custom hooks
- ✅ Use TypeScript strict mode
- ✅ Document complex business logic
- ✅ Keep styles co-located with components when possible
- ✅ Use React Query for server state management
- ✅ Test components and services

### Don'ts ❌
- ❌ Don't import from deep paths (always use barrel exports)
- ❌ Don't mix business logic with UI logic
- ❌ Don't create new folders without clear purpose
- ❌ Don't import from sibling modules directly
- ❌ Don't leave files without proper exports
- ❌ Don't put page-specific logic in global services

## Performance Optimization

- Pages are lazy-loaded using React.lazy()
- Services use React Query for caching and optimization
- Components use React.memo when appropriate
- Unnecessary re-renders are avoided with proper prop management

## Development Workflow

1. **Create the feature** in a new module under `/modules`
2. **Export everything** through barrel files (index.ts)
3. **Create/update types** alongside services
4. **Build components** using base UI components from `/components/ui`
5. **Add route** in `App.tsx` if it's a page
6. **Test** the feature in isolation before integration

## Configuration

- **Environment variables** in `.env` files
- **Global config** in `src/config.ts`
- **Theme config** in `src/theme/`
- **API base URL** managed in `src/services/api.ts`

---

**Last Updated**: February 2026
**Framework**: React + TypeScript + Vite
**UI Library**: shadcn/ui + Tailwind CSS
**State Management**: React Query + Context API
