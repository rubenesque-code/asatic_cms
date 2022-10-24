import { ReactElement } from "react";
import tw from "twin.macro";

export const $RelatedEntitiesContainer = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => (
  <div css={[tw`flex justify-center`]}>
    <div css={[tw`max-w-[65ch] w-full border-l border-r mx-lg`]}>
      {children}
    </div>
  </div>
);
