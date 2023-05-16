import { ReactElement } from "react";
import tw from "twin.macro";

import SubjectSlice from "^context/subjects/SubjectContext";

import Empty from "./child-documents/Empty";
import ChildDocuments from "./child-documents";

const Body = () => {
  const [{ articlesIds, blogsIds, collectionsIds, recordedEventsIds }] =
    SubjectSlice.useContext();

  const isContent =
    articlesIds.length ||
    blogsIds.length ||
    collectionsIds.length ||
    recordedEventsIds.length;

  return (
    <$RelatedEntitiesContainer>
      {isContent ? <ChildDocuments /> : <Empty />}
    </$RelatedEntitiesContainer>
  );
};

export default Body;

const $RelatedEntitiesContainer = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => (
  <div css={[tw`flex justify-center pb-2xl`]}>
    <div css={[tw`max-w-[1300px] w-full border mx-lg`]}>{children}</div>
  </div>
);
