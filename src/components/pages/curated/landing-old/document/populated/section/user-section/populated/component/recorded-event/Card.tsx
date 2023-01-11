/* eslint-disable jsx-a11y/alt-text */
import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { HandleRecordedEventType } from "^components/_containers/handle-sub-entities";
import Menu from "./Menu";
import $CardContainer from "../_presentation/$CardContainer_";
import { $RecordedEventVideoType as $VideoType } from "../_styles";
import {
  Status_,
  Authors_,
  Title_,
} from "^components/pages/curated/_containers/entity-summary";
import { SummaryImage } from "^components/pages/curated/_containers/recorded-event";
import {
  $status,
  $articleLikeImageContainer,
  $Title,
  $authors,
} from "../_styles";
import { PlayIcon } from "^components/Icons";

const Card = () => {
  return (
    <$CardContainer>
      {(isHovered) => (
        <>
          <Status />
          <VideoType />
          <Image />
          <Title />
          <Authors />
          <Menu isShowing={isHovered} />
        </>
      )}
    </$CardContainer>
  );
};

export default Card;

const Status = () => {
  const [{ status, publishDate }] = RecordedEventSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} styles={$status} />;
};

const Image = () => {
  return (
    <div css={[tw`relative h-full`]}>
      <SummaryImage
        containerStyles={$articleLikeImageContainer}
        summaryType="landing"
        isResizable
      />
      <PlayIcon styles={tw`text-6xl left-sm bottom-sm`} />
    </div>
  );
};

const VideoType = () => {
  return (
    <$VideoType>
      <HandleRecordedEventType />
    </$VideoType>
  );
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
    <Authors_
      activeLanguageId={languageId}
      authorsIds={authorsIds}
      styles={$authors}
    />
  );
};
