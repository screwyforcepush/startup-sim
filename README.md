# Startup Simulator

A startup simulation tool designed for Saudi government leaders to rapidly evaluate potential startup ideas in the MENA region. The tool simulates a 5-year trajectory based on key startup parameters, providing quantitative analysis and comparative rankings to inform investment and support decisions.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org)
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
├── docs
│   ├── change-log.md
│   ├── implementation-plan.md
│   ├── requirements.md
│   └── target-architecture.md
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   └── [assets]
├── src
│   ├── app
│   │   ├── fonts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── input-interface
│   │   │   ├── helpers.ts
│   │   │   ├── input-form.tsx
│   │   │   └── types.ts
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── form.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       └── textarea.tsx
│   └── lib
│       ├── data
│       │   ├── business_models.json
│       │   ├── disruption_patterns.json
│       │   ├── nations.json
│       │   ├── sectors.json
│       │   ├── team_archetypes.json
│       │   └── types.ts
│       └── utils.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Features

- Modern React with Server Components
- Type-safe development with TypeScript
- Form validation with Zod and React Hook Form
- Responsive design with Tailwind CSS
- Component library built on Shadcn UI and Radix UI primitives
- Simulation data management with JSON files
- Clean and intuitive user interface

## Development Guidelines

- Use TypeScript for type-safe development
- Follow the component-first architecture
- Utilize Server Components where possible
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