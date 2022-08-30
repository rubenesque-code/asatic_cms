import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";

const ListDocSubDocItemsUI = ({
  children: items,
  containerStyles,
}: {
  children: ReactElement[];
  containerStyles: TwStyle;
}) => {
  return (
    <div style={containerStyles}>
      {items.map((item, i) => (
        <div css={[tw`flex`]} key={i}>
          {item}
          {i < items.length - 1 ? "," : null}
        </div>
      ))}
    </div>
  );
};

export default ListDocSubDocItemsUI;
