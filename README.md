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
- **AI Integration:**
  - [OpenAI API](https://platform.openai.com)
  - [OpenAI Node SDK](https://github.com/openai/openai-node)
- **Language:** [TypeScript](https://www.typescriptlang.org)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o
```

3. Run the development server:

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
│   │   │   └── simulate     # Simulation API endpoints with OpenAI integration
│   │   ├── fonts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx        # Main page with side-by-side input/output
│   ├── components
│   │   ├── input-interface  # Simulation input components
│   │   │   ├── helpers.ts
│   │   │   ├── input-form.tsx
│   │   │   └── types.ts
│   │   ├── output-display   # Simulation results display
│   │   │   ├── helpers.ts   # Data formatting and calculations
│   │   │   ├── output-display.tsx
│   │   │   └── types.ts
│   │   ├── providers.tsx
│   │   └── ui              # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── form.tsx
│   │       ├── select.tsx
│   │       ├── skeleton.tsx
│   │       └── [other components]
│   ├── lib
│   │   ├── data           # Simulation data and types
│   │   │   ├── [json files]
│   │   │   └── types.ts
│   │   └── utils.ts
│   └── store             # Redux state management
│       ├── simulation-slice.ts
│       └── store.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Features

- **Modern React Architecture**
  - Next.js 13 App Router
  - Server and Client Components
  - TypeScript for type safety
  - Redux Toolkit for state management

- **Intuitive User Interface**
  - Side-by-side input and output display
  - Real-time form validation
  - Loading states and error handling
  - Responsive design with Tailwind CSS

- **Simulation Input**
  - Sector selection
  - Nation selection
  - AI Disruption Pattern
  - Business Model
  - Team Archetype
  - Startup Pitch

- **Simulation Output**
  - Year-by-year progression
  - KPI visualization
  - Revenue tracking
  - Market share analysis
  - Milestone tracking
  - Challenge identification
  - Strategic recommendations

- **Data Processing**
  - OpenAI GPT-4 integration
  - JSON data management
  - Type-safe data transformation
  - Error boundary handling

- **Component Library**
  - Shadcn UI integration
  - Custom UI components
  - Form components
  - Loading skeletons
  - Progress indicators

## Development Guidelines

- Use TypeScript for type-safe development
- Follow the component-first architecture
- Utilize Server Components where possible
- Manage global state with Redux Toolkit
- Style with Tailwind CSS utility classes
- Use Shadcn UI components for consistent design
- Implement proper form validation and error handling
- Follow modern React patterns and best practices
- Keep API keys and sensitive data in environment variables

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
- [OpenAI API Documentation](https://platform.openai.com/docs)
