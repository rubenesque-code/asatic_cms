import { HandleEntityAuthors } from "^components/_containers/handle-sub-entities/Authors";
import { $authors } from "../../_styles/$summary";

export const Authors_ = ({
  activeLanguageId,
  authorsIds,
}: {
  activeLanguageId: string;
  authorsIds: string[];
}) => {
  if (!authorsIds.length) {
    return null;
  }

  return (
    <div css={[$authors]}>
      <HandleEntityAuthors
        authorIds={authorsIds}
        activeLanguageId={activeLanguageId}
      />
    </div>
  );
};
