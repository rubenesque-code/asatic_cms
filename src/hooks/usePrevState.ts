import { useEffect, useRef } from "react";

// * can use refs instead of state since don't need to rerender?

function usePrevious<T>({
  data,
  updateOnId,
}: {
  data: T;
  updateOnId: string | undefined;
}) {
  /**
    const [prevState, setPrevState] = useState<T | null>(null);
    const [prevUpdateOnId, setPrevUpdateOnId] = useState<
      string | undefined | null
    >(null);
*/

  const previousRef = useRef<T>(data);

  const previousUpdateOnIdRef = useRef<string | undefined>(updateOnId);
  const previousUpdateOnId = previousUpdateOnIdRef.current;

  useEffect(() => {
    if (updateOnId !== previousUpdateOnId) {
      previousRef.current = data;
      previousUpdateOnIdRef.current = updateOnId;
      // setPrevState(data);
      // setPrevUpdateOnId(updateOnId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateOnId, data]);

  const previousData = previousRef.current;
  return previousData;
}

export default usePrevious;
