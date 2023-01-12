import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import SubjectProvidersWithOwnLanguages from "^components/_containers/subjects/ProvidersWithOwnLanguages";
import { $PageContainer } from "../_styles/$page";
import { $CanvasDefault_ } from "../_presentation";
import Header from "./Header";
import Banner from "./document/Banner";
import DocumentBody from "./document/Body";

const SubjectPage = () => {
  const subjectId = useGetSubRouteId();
  const subject = useSelector((state) => selectSubjectById(state, subjectId))!;

  return (
    <$PageContainer>
      <SubjectProvidersWithOwnLanguages subject={subject}>
        <>
          <Header />
          <$CanvasDefault_ maxWidth={false} usePadding={false}>
            <>
              <Banner />
              <DocumentBody />
            </>
          </$CanvasDefault_>
        </>
      </SubjectProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default SubjectPage;
