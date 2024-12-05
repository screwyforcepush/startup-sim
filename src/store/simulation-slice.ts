import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SimulationInput } from '@/components/input-interface/types';

interface SimulationState {
  inputs: SimulationInput | null;
  currentYear: number;
  isSimulating: boolean;
  yearlyResults: Array<{
    year: number;
    revenue: number;
    metrics: {
      feasibility: number;
      desirability: number;
      viability: number;
    };
    events: string[];
  }>;
  error: string | null;
  savedSimulations: SimulationInput[];
}

const initialState: SimulationState = {
  inputs: null,
  currentYear: 0,
  isSimulating: false,
  yearlyResults: [],
  error: null,
  savedSimulations: [],
};

export const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    setSimulationInputs: (state, action: PayloadAction<SimulationInput>) => {
      state.inputs = action.payload;
    },
    startSimulation: (state) => {
      state.isSimulating = true;
      state.currentYear = 0;
      state.yearlyResults = [];
      state.error = null;
    },
    addYearResult: (state, action: PayloadAction<{
      year: number;
      revenue: number;
      metrics: {
        feasibility: number;
        desirability: number;
        viability: number;
      };
      events: string[];
    }>) => {
      state.yearlyResults.push(action.payload);
      state.currentYear = action.payload.year;
    },
    endSimulation: (state) => {
      state.isSimulating = false;
      if (state.inputs) {
        state.savedSimulations.push(state.inputs);
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isSimulating = false;
    },
    clearSimulation: (state) => {
      state.inputs = null;
      state.currentYear = 0;
      state.isSimulating = false;
      state.yearlyResults = [];
      state.error = null;
    },
  },
});

export const {
  setSimulationInputs,
  startSimulation,
  addYearResult,
  endSimulation,
  setError,
  clearSimulation,
} = simulationSlice.actions;

export default simulationSlice.reducer; 