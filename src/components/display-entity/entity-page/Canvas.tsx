import { ReactElement, createContext, useContext } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";

type ContextValue = {
  containerHeight: number;
};
const Context = createContext<ContextValue>({} as ContextValue);

const Provider = ({
  children,
  containerHeight,
}: { children: ReactElement } & ContextValue) => {
  return (
    <Context.Provider value={{ containerHeight }}>{children}</Context.Provider>
  );
};

export function CanvasContainer({ children }: { children: ReactElement }) {
  return (
    <ContainerUtility.Height
      styles={tw`h-full flex-grow grid place-items-center bg-gray-50 border-t-2 border-gray-200`}
    >
      {(containerHeight) =>
        containerHeight ? (
          <Provider containerHeight={containerHeight}>
            <>{children}</>
          </Provider>
        ) : null
      }
    </ContainerUtility.Height>
  );
}

type CanvasProps = {
  usePadding?: boolean;
  useMaxWidth?: boolean;
};

export function Canvas({
  children,
  usePadding = true,
  useMaxWidth = true,
}: { children: ReactElement } & CanvasProps) {
  const { containerHeight } = useContext(Context);

  return (
    <main
      css={[
        tw`relative w-[95%] overflow-y-auto overflow-x-hidden bg-white shadow-md`,
        usePadding && tw`pl-lg pr-xl`,
        useMaxWidth && tw`max-w-[720px] `,
      ]}
      style={{ height: containerHeight * 0.95 }}
    >
      {children}
    </main>
  );
}

export default function CanvasDefault({
  children,
  ...canvasProps
}: {
  children: ReactElement;
} & CanvasProps) {
  return (
    <CanvasContainer>
      <Canvas {...canvasProps}>{children}</Canvas>
    </CanvasContainer>
  );
}
