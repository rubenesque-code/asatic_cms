import { ReactElement } from "react";
import produce from "immer";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import HeaderUnpopulated from "^components/collections/collection-page/Header";
import ContainersUI from "^components/collections/collection-page/ContainersUI";
import CollectionUI from "^components/collections/collection-page/CollectionUI";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import { generateImgVertPositionProps } from "^helpers/image";
import WithAddDocImage from "^components/WithAddDocImage";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";
import DocLanguages from "^components/DocLanguages";
import InlineTextEditor from "^components/editors/Inline";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import { Article } from "^types/article";
import {
  getArticleSummaryFromTranslation,
  selectTranslationForActiveLanguage,
} from "^helpers/article";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import useCollectionPageTopControls from "^hooks/pages/useCollectionPageTopControls";
import { selectPrimaryContentRelatedToCollection } from "^redux/state/complex-selectors/collections";
import { arrayDivergenceObjWithId } from "^helpers/general";
import { RecordedEvent } from "^types/recordedEvent";
import { Blog } from "^types/blog";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import tw from "twin.macro";
import { Info } from "phosphor-react";
import WithTooltip from "^components/WithTooltip";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";

// todo: list item images

const PageContent = () => {
  return (
    <ContainersUI.FillScreenHeight>
      <Providers>
        <>
          <Header />
          <Main />
        </>
      </Providers>
    </ContainersUI.FillScreenHeight>
  );
};

export default PageContent;

const Providers = ({ children }: { children: ReactElement }) => {
  const collectionId = useGetSubRouteId();
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  )!;

  return (
    <CollectionSlice.Provider collection={collection}>
      {([{ languagesIds, translations }]) => (
        <DocLanguages.SelectProvider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <CollectionTranslationSlice.Provider
              collectionId={collectionId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </CollectionTranslationSlice.Provider>
          )}
        </DocLanguages.SelectProvider>
      )}
    </CollectionSlice.Provider>
  );
};

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData: { isError, isLoading, isSuccess },
  } = useCollectionPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <HeaderUnpopulated
      isChange={isChange}
      save={save}
      saveMutationData={{
        isError,
        isLoading,
        isSuccess,
      }}
      undo={undo}
    />
  );
};

const Main = () => (
  <ContainersUI.ContentCanvas>
    <>
      <CollectionUI.Banner>
        <BannerImage />
        <BannerOverlay />
      </CollectionUI.Banner>
      <List />
    </>
  </ContainersUI.ContentCanvas>
);

const BannerOverlay = () => {
  const [
    {
      image: { id: imageId },
    },
  ] = CollectionSlice.useContext();

  return (
    <CollectionUI.BannerOverlay>
      <DescriptionCard />
      {!imageId ? (
        <CollectionUI.NoImage>
          <AddImageButton />
        </CollectionUI.NoImage>
      ) : null}
    </CollectionUI.BannerOverlay>
  );
};

const BannerImage = () => {
  const [
    {
      image: { vertPosition, id: imageId },
    },
  ] = CollectionSlice.useContext();

  if (!imageId) {
    return null;
  }

  return (
    <>
      <CollectionUI.BannerImage imgId={imageId} vertPosition={vertPosition} />
      <ImageMenu />
    </>
  );
};

const ImageMenu = () => {
  const [
    {
      image: { vertPosition },
    },
    { updateImageVertPosition, updateImageSrc },
  ] = CollectionSlice.useContext();

  const vertPositionProps = generateImgVertPositionProps(
    vertPosition,
    (imgVertPosition) => updateImageVertPosition({ imgVertPosition })
  );

  return (
    <CollectionUI.ImageMenu
      show={true}
      updateImageSrc={(imageId) => updateImageSrc({ imageId })}
      {...vertPositionProps}
    />
  );
};

const AddImageButton = () => {
  const [, { updateImageSrc }] = CollectionSlice.useContext();

  return (
    <WithAddDocImage onAddImage={(imageId) => updateImageSrc({ imageId })}>
      <CollectionUI.AddImageButton>Add image</CollectionUI.AddImageButton>
    </WithAddDocImage>
  );
};

const DescriptionCard = () => (
  <CollectionUI.DescriptionCard>
    <CollectionUI.DescriptionCardSpacer />
    <CollectionUI.CollectionText>collection</CollectionUI.CollectionText>
    <Title />
    <DescriptionText />
    <CollectionUI.DescriptionCardSpacer />
  </CollectionUI.DescriptionCard>
);

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    CollectionTranslationSlice.useContext();

  return (
    <CollectionUI.Title>
      <InlineTextEditor
        injectedValue={title || ""}
        onUpdate={(title) => updateTitle({ title })}
        placeholder="Collection title..."
        key={translationId}
      />
    </CollectionUI.Title>
  );
};

const DescriptionText = () => {
  const [{ id: translationId, description }, { updateDescription }] =
    CollectionTranslationSlice.useContext();

  return (
    <CollectionUI.DescriptionText>
      <SimpleTipTapEditor
        initialContent={description}
        onUpdate={(description) => updateDescription({ description })}
        placeholder="Collection description..."
        key={translationId}
      />
    </CollectionUI.DescriptionText>
  );
};

const List = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();

  const { articles, blogs, recordedEvents } = useSelector((state) =>
    selectPrimaryContentRelatedToCollection(state, collectionId)
  );

  const allContent = [...articles, ...blogs, ...recordedEvents];

  const published = allContent.filter((e) => e.publishDate);
  const byDate = produce(published, (draft) => {
    draft.sort((a, b) => {
      const aDate = a.publishDate!;
      const bDate = b.publishDate!;
      return aDate.getTime() - bDate.getTime();
    });
  });

  const unpublished = arrayDivergenceObjWithId(allContent, published);

  const orderedContent = [...byDate, ...unpublished];

  return (
    <CollectionUI.List>
      {orderedContent.map((doc) => (
        <ListContentTypeSwitch doc={doc} key={doc.id} />
      ))}
    </CollectionUI.List>
  );
};

const ListContentTypeSwitch = ({
  doc,
}: {
  doc: Article | Blog | RecordedEvent;
}) => {
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  return (
    <>
      {doc.type === "article" ? (
        <ArticleSlice.Provider article={doc}>
          {([{ translations }]) => (
            <ArticleTranslationSlice.Provider
              articleId={doc.id}
              translation={selectTranslationForActiveLanguage(
                translations,
                activeLanguageId
              )}
            >
              <ArticleItem />
            </ArticleTranslationSlice.Provider>
          )}
        </ArticleSlice.Provider>
      ) : doc.type === "blog" ? (
        <BlogSlice.Provider blog={doc}>
          {([{ translations }]) => (
            <BlogTranslationSlice.Provider
              blogId={doc.id}
              translation={selectTranslationForActiveLanguage(
                translations,
                activeLanguageId
              )}
            >
              <BlogItem />
            </BlogTranslationSlice.Provider>
          )}
        </BlogSlice.Provider>
      ) : (
        <RecordedEventSlice.Provider recordedEvent={doc}>
          {([{ translations }]) => (
            <RecordedEventTranslationSlice.Provider
              recordedEventId={doc.id}
              translation={selectTranslationForActiveLanguage(
                translations,
                activeLanguageId
              )}
            >
              <RecordedEventItem />
            </RecordedEventTranslationSlice.Provider>
          )}
        </RecordedEventSlice.Provider>
      )}
    </>
  );
};

const ArticleItem = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [translation, { updateCollectionSummary }] =
    ArticleTranslationSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  const { languageId: translationLanguageId, title } = translation;

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  return (
    <CollectionUI.Item>
      {translationLanguageId !== activeLanguageId ? (
        <div css={[tw`absolute left-0 top-0 flex items-center gap-sm`]}>
          <WithTooltip text="this article has no translation for the current language">
            <span>
              <Info />
            </span>
          </WithTooltip>
        </div>
      ) : null}
      <CollectionUI.ItemTitle>{title}</CollectionUI.ItemTitle>
      <CollectionUI.ItemDate></CollectionUI.ItemDate>
      <CollectionUI.ItemAuthors>
        <DocAuthorsText
          authorIds={authorsIds}
          docActiveLanguageId={activeLanguageId}
        />
      </CollectionUI.ItemAuthors>
      <CollectionUI.ItemSummary>
        <SimpleTipTapEditor
          initialContent={summary || undefined}
          onUpdate={(summary) => updateCollectionSummary({ summary })}
        />
      </CollectionUI.ItemSummary>
    </CollectionUI.Item>
  );
};

const BlogItem = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [translation, { updateCollectionSummary }] =
    BlogTranslationSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  const { languageId: translationLanguageId, title } = translation;

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  return (
    <CollectionUI.Item>
      {translationLanguageId !== activeLanguageId ? (
        <div css={[tw`absolute left-0 top-0 flex items-center gap-sm`]}>
          <WithTooltip text="this blog has no translation for the current language">
            <span>
              <Info />
            </span>
          </WithTooltip>
        </div>
      ) : null}
      <CollectionUI.ItemTitle>{title}</CollectionUI.ItemTitle>
      <CollectionUI.ItemDate></CollectionUI.ItemDate>
      <CollectionUI.ItemAuthors>
        <DocAuthorsText
          authorIds={authorsIds}
          docActiveLanguageId={activeLanguageId}
        />
      </CollectionUI.ItemAuthors>
      <CollectionUI.ItemSummary>
        <SimpleTipTapEditor
          initialContent={summary || undefined}
          onUpdate={(summary) => updateCollectionSummary({ summary })}
        />
      </CollectionUI.ItemSummary>
    </CollectionUI.Item>
  );
};

const RecordedEventItem = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [translation] = RecordedEventTranslationSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  const { languageId: translationLanguageId, title } = translation;

  return (
    <CollectionUI.Item>
      {translationLanguageId !== activeLanguageId ? (
        <div css={[tw`absolute left-0 top-0 flex items-center gap-sm`]}>
          <WithTooltip text="this blog has no translation for the current language">
            <span>
              <Info />
            </span>
          </WithTooltip>
        </div>
      ) : null}
      <div css={[tw`flex gap-sm`]}>
        <RecordedEventImage />
        <div>
          <CollectionUI.ItemTitle>{title}</CollectionUI.ItemTitle>
          <CollectionUI.ItemDate></CollectionUI.ItemDate>
          <CollectionUI.ItemAuthors>
            <DocAuthorsText
              authorIds={authorsIds}
              docActiveLanguageId={activeLanguageId}
            />
          </CollectionUI.ItemAuthors>
        </div>
      </div>
    </CollectionUI.Item>
  );
};

const RecordedEventImage = () => {
  const [
    {
      landingImage: {
        imageId,
        autoSection: { imgVertPosition },
      },
      youtubeId,
    },
  ] = RecordedEventSlice.useContext();

  const youtubeVideoThumbnail = youtubeId
    ? getThumbnailFromYoutubeId(youtubeId)
    : null;

  return (
    <CollectionUI.ItemImageContainer>
      {!youtubeId ? (
        <CollectionUI.ItemNoVideo />
      ) : imageId ? (
        <CollectionUI.ItemImage
          imgId={imageId}
          vertPosition={imgVertPosition}
        />
      ) : (
        <CollectionUI.ItemYoutubeImage
          src={youtubeVideoThumbnail!}
          vertPosition={imgVertPosition}
        />
      )}
    </CollectionUI.ItemImageContainer>
  );
};
