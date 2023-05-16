import { useEffect, useRef } from "react";

// * can use refs instead of state since don't need to rerender?

function useUpdateablePrevious<T>({
  currentData,
  updateOn,
}: {
  currentData: T;
  // * could use more value types, but need to consider the comparison in the useEffect
  updateOn: string | undefined;
}) {
  const previousRef = useRef<T>(currentData);

  const previousUpdateOnIdRef = useRef<string | undefined>(updateOn);
  const previousUpdateOnId = previousUpdateOnIdRef.current;

  useEffect(() => {
    if (updateOn !== previousUpdateOnId) {
      previousRef.current = currentData;
      previousUpdateOnIdRef.current = updateOn;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateOn, currentData]);

  const previousData = previousRef.current;
  return previousData;
}

export default useUpdateablePrevious;
