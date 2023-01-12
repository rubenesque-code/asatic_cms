import {
  ReactElement,
  createContext,
  useContext,
  forwardRef,
  ForwardedRef,
} from "react";
import tw, { TwStyle } from "twin.macro";

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

export function $CanvasContainer_({ children }: { children: ReactElement }) {
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
  maxWidth?: false | TwStyle;
};

export function $Canvas_({
  children,
  usePadding = true,
  maxWidth = tw`max-w-[720px]`,
}: { children: ReactElement } & CanvasProps) {
  // const { scrollContainerRef } = useStickyContext();
  const { containerHeight } = useContext(Context);

  return (
    <main
      css={[$canvas, usePadding && tw`pl-lg pr-xl`, maxWidth && maxWidth]}
      style={{ height: containerHeight * 0.95 }}
      // ref={scrollContainerRef}
    >
      {children}
    </main>
  );
}

const $canvas = tw`relative w-[95%] overflow-y-auto overflow-x-hidden bg-white shadow-md`;

// eslint-disable-next-line react/display-name
export const $CanvasWithForwardRef_ = forwardRef(
  (
    {
      children,
      maxWidth = tw`max-w-[720px]`,
      usePadding = true,
    }: { children: ReactElement } & CanvasProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const { containerHeight } = useContext(Context);
    return (
      <div
        css={[$canvas, usePadding && tw`pl-lg pr-xl`, maxWidth && maxWidth]}
        style={{ height: containerHeight * 0.95 }}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

export default function $CanvasDefault_({
  children,
  ...canvasProps
}: {
  children: ReactElement;
} & CanvasProps) {
  return (
    <$CanvasContainer_>
      <$Canvas_ {...canvasProps}>{children}</$Canvas_>
    </$CanvasContainer_>
  );
}
