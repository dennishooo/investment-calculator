import { useState, useEffect } from "react";
import { type CalculatorParams } from "../types";
import { defaultValues, STORAGE_KEY } from "../constants";

export const useCalculatorParams = () => {
  const [params, setParams] = useState<CalculatorParams>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...defaultValues, ...JSON.parse(saved) };
      } catch {
        console.warn("Could not parse saved values, using defaults");
        return defaultValues;
      }
    }
    return defaultValues;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  }, [params]);

  const updateParam = (key: keyof CalculatorParams, value: number | null) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setParams(defaultValues);
  };

  return {
    params,
    updateParam,
    resetToDefaults,
  };
};
