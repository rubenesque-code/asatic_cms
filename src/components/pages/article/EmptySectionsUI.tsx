import { ReactElement } from "react";
import tw from "twin.macro";

const EmptySectionsUI = ({
  addSectionButton,
}: {
  addSectionButton: ReactElement;
}) => (
  <div css={[tw`text-center`]}>
    <p css={[tw`mt-xs text-gray-600`]}>No content for translation</p>
    <div css={[tw`mt-lg`]}>{addSectionButton}</div>
  </div>
);

export default EmptySectionsUI;
