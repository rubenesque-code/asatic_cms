/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import {
  Authors_,
  Title_,
} from "^components/pages/curated/_containers/entity-summary";
import { SummaryImage_ as Image_ } from "^components/pages/curated/_containers/recorded-event";

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
  // return <div css={[tw`relative aspect-ratio[9/5]`]} />;
  return <Image_ containerStyles={tw`relative aspect-ratio[ 9 / 5]`} />;
};

const Title = () => {
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return (
    <$Title>
      <Title_ title={title} />
    </$Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ languageId }] = RecordedEventTranslationSlice.useContext();

  return (
    <$Authors>
      <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />
    </$Authors>
  );
};

const $MetaCard = tw.div`p-sm bg-gray-900 text-white flex-grow`;
const $Title = tw.h2`text-xl`;
const $Authors = tw.div`text-lg mt-xs`;
