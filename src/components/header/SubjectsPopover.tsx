import { Books as BooksIcon } from "phosphor-react";
import tw from "twin.macro";

import WithSubjects, { Props } from "^components/WithSubjects";
// import WithSubjects, { Props } from "^components/sub-doc-popovers/subjects";
import HeaderIconButton from "^components/header/IconButton";
import MissingTranslation from "^components/MissingTranslation";

// type WithSubjects

const SubjectsPopover = (props: Props) => {
  return (
    <WithSubjects {...props}>
      {({ isMissingTranslation }) => (
        <SubjectsPopoverButtonUI isMissingTranslation={isMissingTranslation} />
      )}
    </WithSubjects>
  );
};

export default SubjectsPopover;

const SubjectsPopoverButtonUI = ({
  isMissingTranslation,
}: {
  isMissingTranslation: boolean;
}) => (
  <div css={[tw`relative`]}>
    <HeaderIconButton tooltip="subjects">
      <BooksIcon />
    </HeaderIconButton>
    {isMissingTranslation ? (
      <div
        css={[
          tw`z-40 absolute top-0 right-0 translate-x-2 -translate-y-0.5 scale-90`,
        ]}
      >
        <MissingTranslation tooltipText="missing translation" />
      </div>
    ) : null}
  </div>
);

/*       {({ subjectsStatus }) => (
        <SubjectsPopoverButtonUI
          isMissingTranslation={
            typeof subjectsStatus === "object" &&
            subjectsStatus.includes("missing translation")
          }
        />
<SubjectsPopoverButtonUI
          isMissingTranslation={
            typeof subjectsStatus === "object" &&
            subjectsStatus.includes("missing translation")
          }
        /> 
      )} */
