# ProjeX - Modern Project Management Dashboard

A beautifully crafted, full-featured project management dashboard built with modern React technologies. ProjeX demonstrates production-quality frontend architecture, state management patterns, form handling, and responsive UI design.

**[Live Demo](https://projex-dashboard.vercel.app)** — Click "Quick Demo Login" to explore

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white)

## Features

- **Dashboard Overview** — Stats cards, weekly progress charts, task distribution pie chart, active projects with progress bars, and real-time activity feed
- **Kanban Board** — Drag-and-drop task management across 5 columns (Backlog, To Do, In Progress, In Review, Done) powered by dnd-kit
- **Projects Management** — Grid/List view toggle, filterable by status (Active, Completed, On Hold, Archived), searchable, with progress tracking and team avatars
- **Team Members** — Team directory with roles, departments, status indicators, task statistics, and search functionality
- **Settings** — Tabbed interface (Profile, Appearance, Notifications, Security) with form validation
- **Authentication** — Login/Register pages with social login buttons (Google, GitHub, Apple), form validation, and demo login
- **Dark/Light/System Theme** — Smooth animated theme transitions with system preference detection
- **Responsive Sidebar** — Collapsible sidebar navigation with icon mode (Shadcn UI Sidebar)

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework with hooks and functional components |
| **TypeScript 5.9** | Type safety across the entire codebase |
| **Vite 7** | Lightning-fast build tool and dev server |
| **Tailwind CSS 4** | Utility-first styling with CSS variables theming |
| **Shadcn UI** | Beautiful, accessible component library (27+ components) |
| **Redux Toolkit** | Global state management with slices and selectors |
| **Redux Thunk** | Async operations (data fetching, auth flows) |
| **React Hook Form** | Performant form handling with controlled inputs |
| **Zod** | Schema-based form validation |
| **React Router DOM** | Client-side routing with protected routes |
| **Recharts** | Data visualization (bar charts, pie charts) |
| **dnd-kit** | Drag-and-drop for Kanban board |
| **Lucide React** | Consistent icon library |

## Project Structure

```
src/
├── app/                    # Redux store and typed hooks
├── components/
│   ├── layout/             # Dashboard layout, sidebar, header
│   ├── theme/              # Theme toggle component
│   └── ui/                 # Shadcn UI components (27+ files)
├── features/
│   ├── auth/               # Auth slice and thunks
│   ├── projects/           # Projects slice and thunks
│   ├── tasks/              # Tasks slice and thunks
│   └── team/               # Team slice and thunks
├── hooks/                  # Custom hooks (use-mobile)
├── lib/                    # Utilities and mock data
├── pages/
│   ├── auth/               # Login and Register pages
│   ├── dashboard/          # Dashboard overview
│   ├── kanban/             # Kanban board
│   ├── projects/           # Projects list/grid
│   ├── settings/           # Settings with tabs
│   └── team/               # Team directory
├── providers/              # Theme context provider
├── types/                  # TypeScript type definitions
├── App.tsx                 # Router configuration
├── main.tsx                # App entry point with providers
└── index.css               # Tailwind + theme CSS variables
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/jamshed-iqbal/projex.git

# Navigate to the project
cd projex

# Install dependencies
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) and click **"Quick Demo Login"** to explore the dashboard.

### Build for Production

```bash
npm run build
npm run preview
```

## Architecture Highlights

### State Management
Feature-based Redux Toolkit slices with async thunks for data fetching. Each feature (auth, projects, tasks, team) has its own slice and thunk files, following the recommended Redux Toolkit patterns.

### Type Safety
Comprehensive TypeScript types defined in `src/types/index.ts` covering all entities (User, Project, Task, TeamMember) with strict typing throughout the codebase.

### Form Handling
React Hook Form with Zod schema validation for all forms (login, register, settings). Schemas define validation rules, and the `@hookform/resolvers` package bridges Zod with React Hook Form.

### Theming
CSS custom properties with Tailwind CSS 4 `@theme` directive. Theme switching uses the **View Transitions API** with a circular clip-path reveal animation that expands from the click position — the same technique used on [kevinpowell.co](https://www.kevinpowell.co/). Supports light, dark, and system preference modes.

### Mock Data Layer
All data comes from `src/lib/mock-data.ts` with simulated async delays in thunks. This architecture makes it straightforward to swap mock data for real API calls — just update the thunk functions.

## License

MIT
