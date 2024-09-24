import { useEffect, useRef } from "react";

// Generic typing for the effect function
export default function useDelayedEffect(
  effect: () => void,
  deps: React.DependencyList,
  delay: number = 1000
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any previous timeout if dependencies change
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      effect();
    }, delay);

    // Cleanup the timeout when the effect or dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps); // Trigger the effect whenever dependencies change
}