import { useState, useEffect } from 'react';

const MONTHLY_GOAL_KEY = 'animalplace_monthly_goal';
const GOAL_UPDATED_KEY = 'animalplace_goal_updated';
const DEFAULT_GOAL = 170;

export function useMonthlyGoal() {
  const [monthlyGoal, setMonthlyGoalState] = useState<number>(DEFAULT_GOAL);
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomGoal, setIsCustomGoal] = useState(false);

  useEffect(() => {
    // Carregar meta do localStorage
    const savedGoal = localStorage.getItem(MONTHLY_GOAL_KEY);
    if (savedGoal) {
      const parsedGoal = parseInt(savedGoal);
      if (!isNaN(parsedGoal) && parsedGoal > 0) {
        setMonthlyGoalState(parsedGoal);
        setIsCustomGoal(parsedGoal !== DEFAULT_GOAL);
      }
    }
    setIsLoading(false);
  }, []);

  const setMonthlyGoal = async (newGoal: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (isNaN(newGoal) || newGoal <= 0) {
          throw new Error('Meta deve ser um número válido maior que zero');
        }

        localStorage.setItem(MONTHLY_GOAL_KEY, newGoal.toString());
        localStorage.setItem(GOAL_UPDATED_KEY, new Date().toISOString());
        setMonthlyGoalState(newGoal);
        setIsCustomGoal(newGoal !== DEFAULT_GOAL);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  };

  const resetToDefault = () => {
    localStorage.removeItem(MONTHLY_GOAL_KEY);
    localStorage.removeItem(GOAL_UPDATED_KEY);
    setMonthlyGoalState(DEFAULT_GOAL);
    setIsCustomGoal(false);
  };

  return {
    monthlyGoal,
    setMonthlyGoal,
    resetToDefault,
    isLoading,
    defaultGoal: DEFAULT_GOAL,
    isCustomGoal,
  };
}
