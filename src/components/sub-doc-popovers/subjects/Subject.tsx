import { FileMinus, WarningCircle } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import WithTooltip from "^components/WithTooltip";
import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";
import { useComponentContext } from ".";

const SubjectAsListItem = ({ subjectId }: { subjectId: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return;
};

export default SubjectAsListItem;

const InvalidSubject = ({ subjectId }: { subjectId: string }) => {
  const { removeSubjectFromDoc } = useComponentContext();

  return (
    <div css={[tw`flex items-center gap-sm`]}>
      <ContentMenu.Button
        onClick={() => removeSubjectFromDoc(subjectId)}
        tooltipProps={{ text: "remove subject from doc" }}
      >
        <FileMinus />
      </ContentMenu.Button>
      <SubContentMissingFromStore subContentType="subject" />
      {/*       <WithTooltip
        text={{
          header: "Subject error",
          body: "A subject was added to this document that can't be found. Try refreshing the page. If the problem persists, contact the site developer.",
        }}
      >
        <span css={[tw`text-red-500 bg-white group-hover:z-50`]}>
          <WarningCircle />
        </span>
      </WithTooltip> */}
    </div>
  );
};

const ValidSubject = () => {
  return;
};
