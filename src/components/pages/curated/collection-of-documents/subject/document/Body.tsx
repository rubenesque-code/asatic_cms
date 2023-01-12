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
    <div css={[tw`max-w-[65ch] w-full border-l border-r mx-lg`]}>
      {children}
    </div>
  </div>
);
