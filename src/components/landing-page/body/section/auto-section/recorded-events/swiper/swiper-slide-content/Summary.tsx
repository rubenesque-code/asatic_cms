/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import Image_ from "^components/recorded-events/containers/Image";
import DocAuthorsText from "^components/authors/DocAuthorsText";

// todo: add recordede event type functionality

const Summary = () => {
  return (
    <>
      <Image />
      <$MetaCard>
        <Title />
        <Authors />
      </$MetaCard>
    </>
  );
};

export default Summary;

const Image = () => {
  return (
    <div css={[tw`relative aspect-ratio[9 / 5]`]}>
      <Image_ />
    </div>
  );
};

const $MetaCard = tw.div`p-sm bg-gray-900 text-white`;
const $Title = tw.h2`text-xl`;
const $Authors = tw.p`text-lg`;

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return (
    <$Title css={[!title?.length && tw`bg-white text-gray-placeholder`]}>
      {title?.length ? title : "Title"}
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <$Authors>
      <DocAuthorsText authorIds={authorsIds} docActiveLanguageId={languageId} />
    </$Authors>
  );
};
