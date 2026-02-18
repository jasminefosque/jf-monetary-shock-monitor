import { create } from 'zustand';
import type { ShockEvent } from '@/models/schema';

interface AppState {
  // Date range filter
  startDate: string;
  endDate: string;
  setDateRange: (start: string, end: string) => void;

  // Geography filter
  geography: string;
  setGeography: (geography: string) => void;

  // Event overlay toggle
  showEvents: boolean;
  toggleEvents: () => void;

  // Selected event for modal
  selectedEvent: ShockEvent | null;
  setSelectedEvent: (event: ShockEvent | null) => void;

  // Methodology drawer
  showMethodology: boolean;
  toggleMethodology: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Default date range
  startDate: '2022-01-01',
  endDate: '2024-12-31',
  setDateRange: (start, end) => set({ startDate: start, endDate: end }),

  // Default geography
  geography: 'United States',
  setGeography: (geography) => set({ geography }),

  // Event overlay enabled by default
  showEvents: true,
  toggleEvents: () => set((state) => ({ showEvents: !state.showEvents })),

  // No event selected initially
  selectedEvent: null,
  setSelectedEvent: (event) => set({ selectedEvent: event }),

  // Methodology drawer closed by default
  showMethodology: false,
  toggleMethodology: () => set((state) => ({ showMethodology: !state.showMethodology })),
}));
