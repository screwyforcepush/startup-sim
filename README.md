# Startup Simulator

A startup simulation tool designed for Saudi government leaders to rapidly evaluate potential startup ideas in the MENA region. The tool simulates a 5-year trajectory based on key startup parameters, providing quantitative analysis and comparative rankings to inform investment and support decisions.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org)
- **State Management:**
  - [Redux Toolkit](https://redux-toolkit.js.org)
  - [React Redux](https://react-redux.js.org)
- **Styling:** 
  - [Tailwind CSS](https://tailwindcss.com)
  - [Tailwind Merge](https://github.com/dcastil/tailwind-merge)
  - [Class Variance Authority](https://cva.style/docs)
- **UI Components:**
  - [Shadcn UI](https://ui.shadcn.com)
  - [Radix UI](https://www.radix-ui.com)
  - [Lucide Icons](https://lucide.dev)
- **Form Handling:**
  - [React Hook Form](https://react-hook-form.com)
  - [Zod](https://zod.dev)
- **Language:** [TypeScript](https://www.typescriptlang.org)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
.
├── README.md
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   └── [assets]
├── src
│   ├── app
│   │   ├── api
│   │   │   └── simulate     # Simulation API endpoints
│   │   ├── fonts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── input-interface  # Simulation input components
│   │   │   ├── helpers.ts
│   │   │   ├── input-form.tsx
│   │   │   └── types.ts
│   │   ├── providers.tsx
│   │   └── ui
│   │       └── [ui components]
│   ├── lib
│   │   ├── data            # Simulation data and types
│   │   │   ├── [json files]
│   │   │   └── types.ts
│   │   └── utils.ts
│   └── store              # Redux state management
│       ├── simulation-slice.ts
│       └── store.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Features

- Modern React with Server Components
- Type-safe development with TypeScript
- Global state management with Redux Toolkit
- Form validation with Zod and React Hook Form
- Responsive design with Tailwind CSS
- Component library built on Shadcn UI and Radix UI primitives
- Simulation data management with JSON files
- Clean and intuitive user interface
- RESTful API endpoints for simulation processing
- End-to-end type safety with shared TypeScript interfaces
- Robust error handling and validation

## Development Guidelines

- Use TypeScript for type-safe development
- Follow the component-first architecture
- Utilize Server Components where possible
- Manage global state with Redux Toolkit
- Style with Tailwind CSS utility classes
- Use Shadcn UI components for consistent design
- Implement proper form validation and error handling
- Follow modern React patterns and best practices

## Documentation

- [Requirements](docs/requirements.md)
- [Implementation Plan](docs/implementation-plan.md)
- [Target Architecture](docs/target-architecture.md)
- [Change Log](docs/change-log.md)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [React Hook Form Documentation](https://react-hook-form.com/docs)
- [Zod Documentation](https://zod.dev)
