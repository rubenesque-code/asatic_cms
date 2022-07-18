import { ReactElement } from "react";
import tw from "twin.macro";
import {
  PlusCircle as PlusCircleIcon,
  SquaresFour as SquaresFourIcon,
} from "phosphor-react";

const EmptySectionsUI = ({
  addSectionButton,
}: {
  addSectionButton: ReactElement;
}) => (
  <div css={[tw`text-center`]}>
    <div css={[tw` relative text-gray-400 inline-flex items-center`]}>
      <span css={[tw`text-4xl`]}>
        <SquaresFourIcon />
      </span>
      <span css={[tw`absolute bottom-0 right-0 bg-white text-lg`]}>
        <PlusCircleIcon weight="bold" />
      </span>
    </div>
    <div css={[tw``]}>
      <p css={[tw`font-medium`]}>No sections</p>
      <p css={[tw`mt-xs text-gray-600`]}>
        Get started building the landing page
      </p>
    </div>
    <div css={[tw`mt-lg`]}>{addSectionButton}</div>
  </div>
);

export default EmptySectionsUI;
