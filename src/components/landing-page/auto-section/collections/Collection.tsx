/* eslint-disable jsx-a11y/alt-text */
import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/article";
import { generateImgVertPositionProps } from "^helpers/image";

import SiteLanguage from "^components/SiteLanguage";

import CollectionUI from "./CollectionUI";
import ContainerUtility from "^components/ContainerUtilities";
import StatusLabel from "^components/StatusLabel";

const Collection = ({ id }: { id: string }) => {
  return (
    <CollectionProviders id={id}>
      <ContainerUtility.isHovered styles={tw`h-full`}>
        {(collectionIsHovered) => (
          <CollectionUI.Container>
            <CollectionMenu show={collectionIsHovered} />
            <Status />
            <ContainerUtility.isHovered>
              {(imageIsHovered) => (
                <>
                  <Image />
                  <ImageMenu show={imageIsHovered} />
                </>
              )}
            </ContainerUtility.isHovered>
            <Title />
            <Description />
          </CollectionUI.Container>
        )}
      </ContainerUtility.isHovered>
    </CollectionProviders>
  );
};

export default Collection;

const CollectionProviders = ({
  children,
  id,
}: {
  children: ReactElement;
  id: string;
}) => {
  const collection = useSelector((state) => selectCollectionById(state, id))!;

  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForActiveLanguage(
    collection.translations,
    siteLanguageId
  );

  return (
    <CollectionSlice.Provider collection={collection}>
      <CollectionTranslationSlice.Provider
        collectionId={id}
        translation={translation}
      >
        {children}
      </CollectionTranslationSlice.Provider>
    </CollectionSlice.Provider>
  );
};

const CollectionMenu = ({ show }: { show: boolean }) => {
  const [, { routeToEditPage }] = CollectionSlice.useContext();

  return <CollectionUI.Menu routeToEditPage={routeToEditPage} show={show} />;
};

const Status = () => {
  const [{ publishDate, status }] = CollectionSlice.useContext();

  return (
    <div css={[tw`mb-sm inline-block`]}>
      <StatusLabel publishDate={publishDate} status={status} />
    </div>
  );
};

const Image = () => {
  const [
    {
      image: { id: imageId },
      landing: {
        autoSection: { imgVertPosition },
      },
    },
  ] = CollectionSlice.useContext();

  return (
    <CollectionUI.ImageContainer>
      {imageId ? (
        <CollectionUI.Image imgId={imageId} vertPosition={imgVertPosition} />
      ) : (
        <CollectionUI.NoImage />
      )}
    </CollectionUI.ImageContainer>
  );
};

const ImageMenu = ({ show }: { show: boolean }) => {
  const [
    {
      landing: {
        autoSection: { imgVertPosition },
      },
    },
    { updateAutoSectionImageVertPosition, updateImageSrc },
  ] = CollectionSlice.useContext();

  const imgVertPositionProps = generateImgVertPositionProps(
    imgVertPosition,
    (imgVertPosition) => updateAutoSectionImageVertPosition({ imgVertPosition })
  );

  return (
    <CollectionUI.ImageMenu
      show={show}
      {...imgVertPositionProps}
      updateImageSrc={(imageId) => updateImageSrc({ imageId })}
    />
  );
};

const Title = () => {
  const [{ title }] = CollectionTranslationSlice.useContext();

  return <CollectionUI.Title>{title}</CollectionUI.Title>;
};

const Description = () => {
  const [{ description }] = CollectionTranslationSlice.useContext();

  return (
    <CollectionUI.Description>
      <>
        {description?.length ? (
          description
        ) : (
          <span css={[tw`text-gray-placeholder`]}>No description yet...</span>
        )}
      </>
    </CollectionUI.Description>
  );
};
