import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

// import SubjectProvidersWithOwnLanguages from "^components/_containers/subjects/ProvidersWithOwnLanguages";
import { $PageContainer } from "../_styles/$page";
import { $CanvasDefault_ } from "../../_presentation/$Canvas_";
import Header from "./Header";
import Banner from "./document/Banner";
import DocumentBody from "./document/Body";
import SubjectSlice from "^context/subjects/SubjectContext";
// import SiteLanguage from "^components/SiteLanguage";
// import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";

const SubjectPage = () => {
  const subjectId = useGetSubRouteId();
  const subject = useSelector((state) => selectSubjectById(state, subjectId))!;

  return (
    <$PageContainer>
      <SubjectSlice.Provider subject={subject}>
        <>
          <Header />
          <$CanvasDefault_ maxWidth={false} usePadding={false}>
            <>
              <Banner />
              <DocumentBody />
            </>
          </$CanvasDefault_>
        </>
      </SubjectSlice.Provider>
    </$PageContainer>
  );
};

export default SubjectPage;
