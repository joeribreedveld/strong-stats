"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type StrongEntry = {
  date: Date;
  workout: string;
  exercise: string;
  weight: number;
  reps: number;
  volume: number;
};

type StrongDataContextType = {
  data: StrongEntry[] | null;
  setData: (data: StrongEntry[]) => void;
};

const StrongDataContext = createContext<StrongDataContextType | undefined>(
  undefined
);

export const StrongDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<StrongEntry[] | null>(null);

  return (
    <StrongDataContext.Provider value={{ data, setData }}>
      {children}
    </StrongDataContext.Provider>
  );
};

export const useStrongData = () => {
  const context = useContext(StrongDataContext);
  if (!context)
    throw new Error("useStrongData must be used within StrongDataProvider");
  return context;
};
