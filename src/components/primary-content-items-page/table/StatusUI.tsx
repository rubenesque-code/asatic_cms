import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";

const StatusUI = ({
  children,
  colorStyles,
}: {
  children: string | ReactElement;
  colorStyles: TwStyle;
}) => (
  <span css={[tw`text-center rounded-lg py-0.5 px-2`, colorStyles]}>
    {children}
  </span>
);

export default StatusUI;
