/* eslint-disable jsx-a11y/alt-text */
import { ReactElement } from "react";
import tw from "twin.macro";
import Div from "^components/DivUtilities";
import SiteLanguage from "^components/SiteLanguage";
import {
  CollectionProvider,
  useCollectionContext,
} from "^context/collections/CollectionContext";
import { CollectionTranslationProvider } from "^context/collections/CollectionTranslationContext";
import { selectTranslationForSiteLanguage } from "^helpers/article";
import { generateImgVertPositionProps } from "^helpers/image";
import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/collections";
import CollectionUI from "./CollectionUI";

const Collection = ({ id }: { id: string }) => {
  return (
    <CollectionProviders id={id}>
      <Div.Hover styles={tw`h-full`}>
        {(collectionIsHovered) => (
          <CollectionUI.Container>
            <Menu show={collectionIsHovered} />
            <Div.Hover>
              {(imageIsHovered) => (
                <>
                  <Image />
                  <ImageMenu show={imageIsHovered} />
                </>
              )}
            </Div.Hover>
          </CollectionUI.Container>
        )}
      </Div.Hover>
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
  const collection = useSelector((state) => selectById(state, id))!;

  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForSiteLanguage(
    collection.translations,
    siteLanguageId
  );

  return (
    <CollectionProvider collection={collection}>
      <CollectionTranslationProvider
        collectionId={id}
        translation={translation}
      >
        {children}
      </CollectionTranslationProvider>
    </CollectionProvider>
  );
};

const Menu = ({ show }: { show: boolean }) => {
  const [, { routeToEditPage }] = useCollectionContext();

  return <CollectionUI.Menu routeToEditPage={routeToEditPage} show={show} />;
};

const Status = () => {
  return w;
};

const Image = () => {
  const [
    {
      imageId,
      landing: {
        autoSection: { imgVertPosition },
      },
    },
  ] = useCollectionContext();

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
    { updateLandingAutoSectionImageVertPosition, updateImageSrc },
  ] = useCollectionContext();

  const imgVertPositionProps = generateImgVertPositionProps(
    imgVertPosition,
    (imgVertPosition) =>
      updateLandingAutoSectionImageVertPosition({ imgVertPosition })
  );

  return (
    <CollectionUI.ImageMenu
      show={show}
      {...imgVertPositionProps}
      updateImageSrc={(imageId) => updateImageSrc({ imageId })}
    />
  );
};
