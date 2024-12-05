.
├── README.md
├── components.json
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── api
│   │   │   └── simulate
│   │   │       └── route.ts          # API route for simulation engine backend
│   │   ├── favicon.ico
│   │   ├── fonts
│   │   │   ├── geist-mono-vf.woff
│   │   │   └── geist-vf.woff
│   │   ├── globals.css
│   │   ├── layout.tsx                # Main layout component
│   │   ├── page.tsx                  # Home page with input interface and output display
│   ├── components
│   │   ├── input-interface           # Input interface components
│   │   │   ├── input-form.tsx        # Main input form component
│   │   │   ├── helpers.ts            # Helper functions for input processing
│   │   │   └── types.ts              # TypeScript interfaces for input data
│   │   ├── output-display            # Output display components
│   │   │   ├── output-display.tsx    # Main output display component displaying simulation outputs
│   │   │   ├── kpi-chart.tsx         # KPI visualization component
│   │   │   ├── helpers.ts            # Helper functions for output processing
│   │   │   └── types.ts              # TypeScript interfaces for output data
│   │   └── ui                        # Shared UI components
│   │       ├── button.tsx            # npx shadcn@latest add button
│   │       ├── modal.tsx             # npx shadcn@latest add modal
│   │       └── ...                   # Other shared UI components
│   ├── lib
│   │   ├── data
│   │   │   ├── business-models.json
│   │   │   ├── disruption-patterns.json
│   │   │   ├── nations.json
│   │   │   ├── sectors.json
│   │   │   └── team-archetypes.json
│   │   └── utils.ts                  # Utility functions
│   ├── store
│   │   └── simulation-slice.ts       # Redux slice for simulation state
│   └── styles
│       └── tailwind.css              # Tailwind CSS customizations
├── tailwind.config.ts
└── tsconfig.json
```

## Explanation of Structure

### `src/app`

- **`api/simulate/route.ts`**: Server-side API route handling simulation requests. Implements the backend logic to interact with the OpenAI GPT-4 API for simulating each year.

- **`layout.tsx`**: Defines the root layout of the application, including global navigation or footer components if needed.

- **`page.tsx`**: The home page containing the input interface where users can enter simulation parameters.

### `src/components`

- **`input-interface`**: Contains components related to the input form.
  - **`input-form.tsx`**: Main component rendering the input form using Shadcn UI components.
  - **`helpers.ts`**: Helper functions for input validation and processing.
  - **`types.ts`**: TypeScript interfaces defining the shape of input data.

- **`output-display`**: Contains components for displaying simulation results.
  - **`output-display.tsx`**: Main component for rendering simulation outputs, including year-by-year progression and KPIs.
  - **`kpi-chart.tsx`**: Uses Tremor or Recharts to visualize KPIs and metrics.
  - **`helpers.ts`**: Helper functions for processing output data.
  - **`types.ts`**: TypeScript interfaces for output data structures.

- **`ui`**: Shared UI components built with Shadcn UI and Tailwind CSS.
  - **`button.tsx`**, **`modal.tsx`**, etc.: Reusable UI components following the design system.

### `src/lib`

- **`data`**: Stores static JSON files required for input parameters.
  - **`business-models.json`**, **`disruption-patterns.json`**, **`nations.json`**, **`sectors.json`**, **`team-archetypes.json`**.

- **`utils.ts`**: Utility functions used across the application, such as data fetching helpers or common transformations.

### `src/store`

- **`simulation-slice.ts`**: Manages the simulation state using Redux Toolkit. Contains actions and reducers for handling simulation data.

### `src/styles`

- **`tailwind.css`**: Custom Tailwind CSS configurations and directives.

## Notes on Conventions

- **Naming**: All directories use lowercase with dashes (e.g., `input-interface`, `output-display`).

- **Exports**: Components use named exports for consistency and easier imports.

- **TypeScript**: Interfaces are used over types for defining props and data structures.

- **Functional Components**: All React components are functional and use TypeScript interfaces for props.

- **UI and Styling**: Uses Shadcn UI components styled with Tailwind CSS, ensuring a consistent and responsive design.

- **Performance Optimization**:
  - Minimal use of `'use client'`; primarily in components that need access to browser-specific APIs like Local Storage.
  - Components that require client-side rendering are wrapped in `Suspense` with appropriate fallbacks.
  - Dynamic imports are used for heavy, non-critical components to improve initial load performance.
  - Images are optimized using WebP format with proper sizing and lazy loading.

- **Data Management**: Utilizes Redux Toolkit for state management, following best practices for scalability.

- **Routing and Data Fetching**: Follows Next.js 13 conventions for app directory routing and server-side data fetching.

## Additional Considerations

- **Simulation Engine**: The backend logic in `api/simulate/route.ts` should handle asynchronous communication with the OpenAI API, ensuring year-by-year results are streamed to the frontend as they are generated.

- **Local Storage**: Implemented within client components to store and retrieve past simulations for comparative analysis.

- **Responsive Design**: All components are designed mobile-first and are fully responsive across different device sizes.

- **Accessibility**: UI components adhere to accessibility standards, ensuring the tool is usable by all users.

- **Error Handling**: Robust error handling and validation are implemented, especially in user inputs and API communications.

By following this structured approach, the project will be well-organized, maintainable, and scalable, aligning with both the technical requirements and the specified conventions.