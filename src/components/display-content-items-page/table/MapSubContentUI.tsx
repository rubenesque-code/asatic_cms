import { ReactElement } from "react";
import tw from "twin.macro";

const MapSubContentUI = ({
  ids,
  subContentItem,
}: {
  ids: string[];
  subContentItem: ({ id }: { id: string }) => ReactElement;
}) => (
  <div css={[tw`flex gap-xs`]}>
    {ids.length ? (
      ids.map((id, i) => (
        <div css={[tw`flex`]} key={id}>
          {subContentItem({ id })}
          {i < ids.length - 1 ? "," : null}
        </div>
      ))
    ) : (
      <span css={[tw`w-full text-center`]}>-</span>
    )}
  </div>
);

export default MapSubContentUI;
