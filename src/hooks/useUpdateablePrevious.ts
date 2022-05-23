import { useEffect, useRef } from "react";

// * can use refs instead of state since don't need to rerender?

function useUpdateablePrevious<T>({
  currentData,
  dependencyToUpdateOn,
}: {
  currentData: T;
  // * could use more value types, but need to consider the comparison in the useEffect
  dependencyToUpdateOn: string | undefined;
}) {
  const previousRef = useRef<T>(currentData);

  const previousUpdateOnIdRef = useRef<string | undefined>(
    dependencyToUpdateOn
  );
  const previousUpdateOnId = previousUpdateOnIdRef.current;

  useEffect(() => {
    if (dependencyToUpdateOn !== previousUpdateOnId) {
      previousRef.current = currentData;
      previousUpdateOnIdRef.current = dependencyToUpdateOn;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dependencyToUpdateOn, currentData]);

  const previousData = previousRef.current;
  return previousData;
}

export default useUpdateablePrevious;
