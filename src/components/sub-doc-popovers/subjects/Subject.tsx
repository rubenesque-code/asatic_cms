import { FileMinus, WarningCircle } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import WithTooltip from "^components/WithTooltip";
import SubjectSlice from "^context/subjects/SubjectContext";
import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";
import { useComponentContext } from ".";
import PanelUI from "../PanelUI";

const SubjectAsListItem = ({ subjectId }: { subjectId: string }) => {
  const subject = useSelector((state) => selectSubjectById(state, subjectId));

  return subject ? (
    <SubjectSlice.Provider subject={subject}>
      <Subject />
    </SubjectSlice.Provider>
  ) : (
    <MissingSubject subjectId={subjectId} />
  );
};

export default SubjectAsListItem;

const MissingSubject = ({ subjectId }: { subjectId: string }) => {
  const { removeSubjectFromDoc } = useComponentContext();

  return (
    <PanelUI.MissingEntity docType="subject">
      <PanelUI.EntityMenu
        docType="subject"
        removeFromDoc={() => removeSubjectFromDoc(subjectId)}
      />
    </PanelUI.MissingEntity>
  );
};

const Subject = () => {
  const { removeSubjectFromDoc , docLanguagesIds} = useComponentContext();
  const [{ id: subjectId }] = SubjectSlice.useContext();

  // todo: actually want 
  const subjectTranslationsUsedInDoc = docLanguagesIds.map(languageId => )

  return (
    <PanelUI.Entity>
      <>
        <PanelUI.ValidEntityMenuWrapper>
          <PanelUI.EntityMenu
            docType="subject"
            removeFromDoc={() => removeSubjectFromDoc(subjectId)}
          />
        </PanelUI.ValidEntityMenuWrapper>
        <PanelUI.DivideEntityTranslations docLanguageTranslations={} />
      </>
    </PanelUI.Entity>
  ); 
};
