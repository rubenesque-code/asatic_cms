import { ReactElement } from "react";
import produce from "immer";
import { ArrowSquareOut, Info, Trash } from "phosphor-react";
import tw from "twin.macro";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";
import { selectPrimaryContentRelatedToCollection } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";

import { generateImgVertPositionProps } from "^helpers/image";
import {
  getArticleSummaryFromTranslation,
  selectTranslationForActiveLanguage,
} from "^helpers/article";
import { arrayDivergenceObjWithId } from "^helpers/general";
import { getThumbnailFromYoutubeId } from "^helpers/youtube";

import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { RecordedEvent } from "^types/recordedEvent";

import Header from "^components/collections/collection-page-old/Header";
import ContainersUI from "^components/collections/collection-page-old/ContainersUI";
import CollectionUI from "^components/collections/collection-page-old/CollectionUI";
import WithAddDocImage from "^components/WithAddDocImage";
import DocLanguages from "^components/DocLanguages";
import InlineTextEditor from "^components/editors/Inline";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import WithTooltip from "^components/WithTooltip";
import ContentMenu from "^components/menus/Content";
import ContainerUtility from "^components/ContainerUtilities";

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
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
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
        </DocLanguages.Provider>
      )}
    </CollectionSlice.Provider>
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
      <>
        {orderedContent.map((doc) => (
          <ListContentTypeSwitch doc={doc} key={doc.id} />
        ))}
      </>
    </CollectionUI.List>
  );
};

const ListContentTypeSwitch = ({
  doc,
}: {
  doc: Article | Blog | RecordedEvent;
}) => {
  const [{ activeLanguageId }] = DocLanguages.useContext();

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
  const [{ activeLanguageId }] = DocLanguages.useContext();

  const { languageId: translationLanguageId, title } = translation;

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  return (
    <ContainerUtility.isHovered>
      {(isHovered) => (
        <>
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
            <CollectionUI.ItemTitle>
              {title?.length ? (
                title
              ) : (
                <p css={[tw`text-gray-400 font-sans text-lg`]}>
                  No title for translation
                </p>
              )}
            </CollectionUI.ItemTitle>
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
                placeholder="write collection summary here"
              />
            </CollectionUI.ItemSummary>
          </CollectionUI.Item>
          <ArticleMenu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

const ArticleMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const [, { routeToEditPage, removeCollection }] = ArticleSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute top-0 right-0`}>
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{ text: "Go to article page" }}
      >
        <ArrowSquareOut />
      </ContentMenu.Button>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove article from this collection" }}
        warningProps={{
          callbackToConfirm: () => removeCollection({ collectionId }),
          warningText: "Remove article?",
          type: "moderate",
        }}
      >
        <Trash />
      </ContentMenu.ButtonWithWarning>
    </ContentMenu>
  );
};

const BlogItem = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [translation, { updateCollectionSummary }] =
    BlogTranslationSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  const { languageId: translationLanguageId, title } = translation;

  const summary = getArticleSummaryFromTranslation(translation, "collection");

  return (
    <ContainerUtility.isHovered>
      {(isHovered) => (
        <>
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
            <CollectionUI.ItemTitle>
              {title?.length ? (
                title
              ) : (
                <p css={[tw`text-gray-400 font-sans text-lg`]}>
                  No title for translation
                </p>
              )}
            </CollectionUI.ItemTitle>
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
                placeholder="write collection summary here"
              />
            </CollectionUI.ItemSummary>
          </CollectionUI.Item>
          <BlogMenu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

const BlogMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const [, { routeToEditPage, removeCollection }] = BlogSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute top-0 right-0`}>
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{ text: "Go to blog page" }}
      >
        <ArrowSquareOut />
      </ContentMenu.Button>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove blog from this collection" }}
        warningProps={{
          callbackToConfirm: () => removeCollection({ collectionId }),
          warningText: "Remove blog?",
          type: "moderate",
        }}
      >
        <Trash />
      </ContentMenu.ButtonWithWarning>
    </ContentMenu>
  );
};

const RecordedEventItem = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [translation] = RecordedEventTranslationSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  const { languageId: translationLanguageId, title } = translation;

  return (
    <ContainerUtility.isHovered>
      {(isHovered) => (
        <>
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
              <div css={[tw`w-2/5`]}>
                <RecordedEventImage />
              </div>
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
          <RecordedEventMenu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
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

const RecordedEventMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const [, { routeToEditPage, removeCollection }] =
    RecordedEventSlice.useContext();

  return (
    <ContentMenu show={isShowing} styles={tw`absolute top-0 right-0`}>
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{ text: "Go to recorded event page" }}
      >
        <ArrowSquareOut />
      </ContentMenu.Button>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove recorded event from this collection" }}
        warningProps={{
          callbackToConfirm: () => removeCollection({ collectionId }),
          warningText: "Remove recorded event?",
          type: "moderate",
        }}
      >
        <Trash />
      </ContentMenu.ButtonWithWarning>
    </ContentMenu>
  );
};
