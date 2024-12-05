# Startup Simulator
## Requirements Specification v1.0

### Project Overview
A startup simulation tool designed for Saudi government leaders to rapidly evaluate potential startup ideas in the MENA region. The tool simulates a 5-year trajectory based on key startup parameters, providing quantitative analysis and comparative rankings to inform investment and support decisions.

### Business Context
- **Target Users**: Government leaders and investors in Saudi Arabia
- **Strategic Goal**: Support Vision 2030 innovation and entrepreneurship initiatives
- **Key Value**: Rapid iteration and comparison of startup ideas before real-world investment

### Core Requirements

1. **Input Parameters**
```
Required inputs per simulation:
- Sector from sectors.json
- Nation from nations.json
- AI Disruption Pattern from disruption_patterns.json
- Business Model from business_models.json
- Team Archetype from team_archetypes.json
- Startup pitch (freeform text)
```

2. **Simulation Engine**
```
Inputs are sent to the backend
backend calls openai API gpt-4o to simulate a year
repeat 5 times (5 year sim)
each response is sent to the front end when generated so user can see year by year progress.

A. Core Mechanics
- One-shot simulation covering 5 years
- Year-by-year progression with threshold checks
- Basic "D&D style" random modifiers
- Growth compounding for successful ventures

B. Key Performance Indicators (0-100)
- Feasibility: Team & technical capability match
- Desirability: Market fit and adoption potential
- Viability: Business model sustainability

C. Progression System
- Early adopter → Early majority transition checks
- Minimum threshold requirements per year
- Compounding effects when exceeding thresholds
```

3. **Output Generation**
```
A. Individual Simulation Results
- Year-by-year revenue/metrics table
- Key performance indicators tracking
- Critical success/failure points
- Strategic recommendations

B. Comparative Analysis
- Ranking across stored simulations
- KPI comparisons
- Success rate analysis
```

4. **Data Storage**
```
- Store simulation runs with unique identifiers
- Track key parameters and outcomes
- Enable sorting/filtering by various metrics
- Local Storage-based storage for comparison
```

### Technical Requirements

Next.js with React and TypeScript for building the user interface.
Tailwind CSS, redux, shadn ui
Utilize data visualization libraries like Tremor or Recharts to display KPIs and metrics.

### User Interface Requirements

1. **Input Interface**
- Clear parameter selection
- Validation of required fields
- Option to duplicate/modify previous runs

2. **Output Display**
- Clean, business-focused presentation
- Emphasis on quantitative metrics
- Clear success/failure indicators
- Comparative rankings when applicable

### Success Criteria
1. Tool enables rapid iteration of startup ideas
2. Output provides actionable insights
3. Results are easy to understand for non-technical users
4. Comparative analysis helps identify strongest ideas
5. Simulation includes relevant MENA market factors

### Limitations & Constraints
1. Simplified model - not full business simulation
2. Focus on high-level strategic factors
3. Results are directional, not predictive
4. Limited to available input parameters
