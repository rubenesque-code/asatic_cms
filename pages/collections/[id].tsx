import { NextPage } from "next";
import { ReactElement } from "react";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/collections";

import {
  CollectionProvider,
  useCollectionContext,
} from "^context/collections/CollectionContext";

import { Collection } from "^types/collection";

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
import { CollectionTranslationProvider } from "^context/collections/CollectionTranslationContext";
import SelectEditDocTranslations from "^components/DocTranslations";

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
  const id = useGetSubRouteId();
  const collection = useSelector((state) => selectById(state, id))!;

  return (
    <ContainersUI.FillScreenHeight>
      <Providers collection={collection}>
        <>
          <Header />
          <Main />
        </>
      </Providers>
    </ContainersUI.FillScreenHeight>
  );
};

const Providers = ({
  children,
  collection,
}: {
  children: ReactElement;
  collection: Collection;
}) => (
  <CollectionProvider collection={collection}>
    <TranslationProviders>{children}</TranslationProviders>
  </CollectionProvider>
);

const TranslationProviders = ({ children }: { children: ReactElement }) => {
  const [
    { id, languagesIds, translations },
    { addTranslation, removeTranslation },
  ] = useCollectionContext();

  return (
    <SelectEditDocTranslations.Provider
      docLanguagesIds={languagesIds}
      docType="collection"
      onAddTranslationToDoc={(languageId) => addTranslation({ languageId })}
      onRemoveTranslationFromDoc={(languageId) =>
        removeTranslation({ languageId })
      }
    >
      {({ activeLanguageId }) => (
        <CollectionTranslationProvider
          collectionId={id}
          translation={
            translations.find((t) => t.languageId === activeLanguageId)!
          }
        >
          {children}
        </CollectionTranslationProvider>
      )}
    </SelectEditDocTranslations.Provider>
  );
};

const Header = () => {
  const [{ id: collectionId }] = useCollectionContext();
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
      </CollectionUI.Banner>
      <CollectionUI.DescriptionCard>
        <CollectionUI.CollectionText> collection</CollectionUI.CollectionText>
      </CollectionUI.DescriptionCard>
    </>
  </ContainersUI.ContentCanvas>
);

const BannerImage = () => {
  const [
    {
      image: { vertPosition, id: imageId },
    },
  ] = useCollectionContext();

  return imageId ? (
    <>
      <CollectionUI.BannerImage imgId={imageId} vertPosition={vertPosition} />
      <ImageMenu />
    </>
  ) : (
    <CollectionUI.NoImage>
      <AddImageButton />
    </CollectionUI.NoImage>
  );
};

const ImageMenu = () => {
  const [
    {
      image: { vertPosition },
    },
    { updateImageVertPosition, updateImageSrc },
  ] = useCollectionContext();

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
  const [, { updateImageSrc }] = useCollectionContext();

  return (
    <WithAddDocImage onAddImage={(imageId) => updateImageSrc({ imageId })}>
      <CollectionUI.AddImageButton>Add image</CollectionUI.AddImageButton>
    </WithAddDocImage>
  );
};

const Title = () => {
  // const [] =
  return <CollectionUI.Title></CollectionUI.Title>;
};
