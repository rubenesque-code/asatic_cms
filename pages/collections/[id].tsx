import { NextPage } from "next";
import { ReactElement } from "react";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { useSelector } from "^redux/hooks";
import {
  selectById,
  selectPrimaryContentRelatedToCollection,
} from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import { Collection as CollectionType } from "^types/collection";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";
import HeaderUnpopulated from "^components/collections/collection-page/Header";
import useCollectionPageSaveUndo from "^hooks/save-undo/useCollectionSaveUndo";
import { useSaveCollectionPageMutation } from "^redux/services/saves";
import ContainersUI from "^components/collections/collection-page/ContainersUI";
import CollectionUI from "^components/collections/collection-page/CollectionUI";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import { generateImgVertPositionProps } from "^helpers/image";
import WithAddDocImage from "^components/WithAddDocImage";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";
import DocLanguages from "^components/DocTranslations";
import InlineTextEditor from "^components/editors/Inline";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import { dicToArr } from "^helpers/general";
import { Article } from "^types/article";
import { selectTranslationForSiteLanguage } from "^helpers/article";
import DocAuthorsText from "^components/authors/DocAuthorsText";

// todo: fin collection(s); apply state generics; uploaded images component

const CollectionPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.AUTHORS,
          CollectionKey.COLLECTIONS,
          CollectionKey.IMAGES,
          CollectionKey.LANGUAGES,
          CollectionKey.TAGS,
        ]}
      >
        <HandleRouteValidity docType="collection">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default CollectionPage;

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

const Providers = ({ children }: { children: ReactElement }) => {
  const id = useGetSubRouteId();
  const collection = useSelector((state) => selectById(state, id))!;

  return (
    <CollectionSlice.Provider collection={collection}>
      <TranslationProviders>{children}</TranslationProviders>
    </CollectionSlice.Provider>
  );
};

const TranslationProviders = ({ children }: { children: ReactElement }) => {
  const [
    { id, languagesIds, translations },
    { addTranslation, removeTranslation },
  ] = CollectionSlice.useContext();

  return (
    <DocLanguages.Provider
      docLanguagesIds={languagesIds}
      docType="collection"
      onAddLanguageToDoc={(languageId) => addTranslation({ languageId })}
      onRemoveLanguageFromDoc={(languageId) =>
        removeTranslation({ languageId })
      }
    >
      {({ activeLanguageId }) => (
        <CollectionTranslationSlice.Provider
          collectionId={id}
          translation={
            translations.find((t) => t.languageId === activeLanguageId)!
          }
        >
          {children}
        </CollectionTranslationSlice.Provider>
      )}
    </DocLanguages.Provider>
  );
};

const Header = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const [saveToDb, { isError, isLoading, isSuccess, requestId }] =
    useSaveCollectionPageMutation();

  const { currentData, isChange, undo } = useCollectionPageSaveUndo({
    saveId: requestId,
    collectionId,
  });

  useLeavePageConfirm({ runConfirmOn: isChange });

  const handleSave = () => {
    if (!isChange) {
      return;
    }
    saveToDb(currentData);
  };

  return (
    <HeaderUnpopulated
      isChange={isChange}
      save={handleSave}
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

  const relatedPrimaryContent = useSelector((state) =>
    selectPrimaryContentRelatedToCollection(state, collectionId)
  );

  return <CollectionUI.List></CollectionUI.List>;
};

const ArticleItem = ({ article }: { article: Article }) => {
  const { translations, authorsIds } = article;
  const [{ activeLanguageId }] = DocLanguages.useContext();

  const { title, body } = selectTranslationForSiteLanguage(
    translations,
    activeLanguageId
  );

  return (
    <CollectionUI.Item>
      <CollectionUI.ItemTitle>{translation.title}</CollectionUI.ItemTitle>
      <CollectionUI.ItemDate></CollectionUI.ItemDate>
      <CollectionUI.ItemAuthors>
        <DocAuthorsText
          authorIds={authorsIds}
          docActiveLanguageId={activeLanguageId}
        />
      </CollectionUI.ItemAuthors>
      <CollectionUI.ItemSummary></CollectionUI.ItemSummary>
    </CollectionUI.Item>
  );
};
