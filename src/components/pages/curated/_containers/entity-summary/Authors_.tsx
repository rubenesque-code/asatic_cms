import tw, { TwStyle } from "twin.macro";
import { HandleEntityAuthors } from "^components/_containers/handle-sub-entities/Authors";

export const Authors_ = ({
  activeLanguageId,
  authorsIds,
  styles,
}: {
  activeLanguageId: string;
  authorsIds: string[];
  styles?: TwStyle;
}) => {
  if (!authorsIds.length) {
    return null;
  }

  return (
    <div css={[tw`flex items-center`, styles]}>
      <HandleEntityAuthors
        authorIds={authorsIds}
        activeLanguageId={activeLanguageId}
      />
    </div>
  );
};
