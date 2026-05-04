import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type TArgument } from '@/core/models/Argument.model';

export type ArgumentsState = {
  items: TArgument[];
  isLoading: boolean;
  error: string | null;
  cameFromRefutations: boolean;
};

const initialState: ArgumentsState = {
  items: [],
  isLoading: false,
  error: null,
  cameFromRefutations: false,
};

const argumentsSlice = createSlice({
  name: 'arguments',
  initialState,
  reducers: {
    setArguments(state, action: PayloadAction<TArgument[]>) {
      state.items = action.payload;
    },
    updateArgumentStatus(state, action: PayloadAction<{ id: string | number; status: string }>) {
      const arg = state.items.find((item) => item.id === action.payload.id);
      if (arg) {
        arg.status = action.payload.status;
      }
    },
    addArgument(state, action: PayloadAction<TArgument>) {
      state.items.push(action.payload);
    },

    delArgument(state, action: PayloadAction<string | number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setCameFromRefutations(state, action: PayloadAction<boolean>) {
      state.cameFromRefutations = action.payload;
    },
  },
});
export const { setArguments, addArgument, delArgument } = argumentsSlice.actions;

export const argumentsReducer = argumentsSlice.reducer;
