import { useSelector } from "^redux/hooks";
import { selectSubjectById } from "^redux/state/subjects";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import SubjectProvidersWithOwnLanguages from "^components/_containers/subjects/ProvidersWithOwnLanguages";
import { $PageContainer } from "../_styles";
import $Canvas_ from "../_presentation/$Canvas_";
import Header from "./Header";
import Document from "./document";

const SubjectPage = () => {
  const subjectId = useGetSubRouteId();
  const subject = useSelector((state) => selectSubjectById(state, subjectId))!;

  return (
    <$PageContainer>
      <SubjectProvidersWithOwnLanguages subject={subject}>
        <>
          <Header />
          <$Canvas_ maxWidth={false} usePadding={false}>
            <>
              {/* <Document /> */}
              <div>HELLO</div>
            </>
          </$Canvas_>
        </>
      </SubjectProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default SubjectPage;
