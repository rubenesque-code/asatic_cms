import ArticleEditor from "^components/editors/tiptap/ArticleEditor";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import { getYoutubeEmbedUrlFromId } from "^helpers/youtube";
import RecordedEventUI from "./RecordedEventUI";

const RecordedEventBody = () => {
  return (
    <RecordedEventUI.Body>
      <VideoSection />
      <ArticleBody />
    </RecordedEventUI.Body>
  );
};

export default RecordedEventBody;

const VideoSection = () => {
  const [{ youtubeId }, {}] = RecordedEventSlice.useContext();

  return (
    <RecordedEventUI.VideoSection>
      {youtubeId ? <Video /> : <VideoEmpty />}
    </RecordedEventUI.VideoSection>
  );
};

const VideoEmpty = () => {
  const [{}, { updateVideoSrc }] = RecordedEventSlice.useContext();

  return (
    <RecordedEventUI.VideoEmpty
      addYoutubeVideoProps={{
        onAddVideo: (youtubeId) => updateVideoSrc({ youtubeId }),
      }}
    />
  );
};

const Video = () => {
  const [{ youtubeId }, { updateVideoSrc }] = RecordedEventSlice.useContext();

  const url = getYoutubeEmbedUrlFromId(youtubeId!);

  return (
    <RecordedEventUI.VideoContainer>
      {(isHovered) => (
        <>
          <RecordedEventUI.Video src={url} />
          <RecordedEventUI.VideoMenu
            addYoutubeVideoProps={{
              onAddVideo: (youtubeId) => updateVideoSrc({ youtubeId }),
            }}
            isShowing={isHovered}
          />
        </>
      )}
    </RecordedEventUI.VideoContainer>
  );
};

const ArticleBody = () => {
  const [{ body, id: translationId }, { updateBody }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <RecordedEventUI.ArticleBody>
      <ArticleEditor
        initialContent={body || undefined}
        onUpdate={(body) => updateBody({ body })}
        placeholder="optional video description..."
        key={translationId}
      />
    </RecordedEventUI.ArticleBody>
  );
};
