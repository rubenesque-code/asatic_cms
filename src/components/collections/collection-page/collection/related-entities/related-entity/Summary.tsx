import { ReactElement } from "react";
import tw from "twin.macro";
import dateformat from "dateformat";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import DocLanguages from "^components/DocLanguages";
import ContentMenu from "^components/menus/Content";
import { GoToPageIcon, RemoveRelatedEntityIcon } from "^components/Icons";
import ContainerUtility from "^components/ContainerUtilities";

import { Title as $Title, Authors as $Authors, menu } from "./styles";

export const Container = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => {
  return (
    <ContainerUtility.isHovered>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
};

export const Title = ({ title }: { title: string | undefined }) => {
  return <$Title css={[!title && tw`text-gray-placeholder`]}>{title}</$Title>;
};

export const Authors = ({ authorsIds }: { authorsIds: string[] }) => {
  const [{ activeLanguageId }] = DocLanguages.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <$Authors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </$Authors>
  );
};

export const Date = ({ publishDate }: { publishDate: Date | undefined }) => {
  if (!publishDate) {
    return null;
  }

  const dateStr = dateformat(publishDate, "mmmm dS yyyy");

  return <>{dateStr}</>;
};

export const Menu = ({
  children: extraButtons,
  isShowing,
  removeDocFromCollection,
  routeToEditPage,
}: {
  children?: ReactElement;
  isShowing: boolean;
  routeToEditPage: () => void;
  removeDocFromCollection: () => void;
}) => {
  return (
    <ContentMenu show={isShowing} styles={menu}>
      <>
        {extraButtons ? extraButtons : null}
        <ContentMenu.Button
          onClick={routeToEditPage}
          tooltipProps={{ text: "go to edit document page" }}
        >
          <GoToPageIcon />
        </ContentMenu.Button>
        <ContentMenu.ButtonWithWarning
          tooltipProps={{ text: "remove document from collection" }}
          warningProps={{
            callbackToConfirm: removeDocFromCollection,
            warningText: "Remove document from collection?",
          }}
        >
          <RemoveRelatedEntityIcon />
        </ContentMenu.ButtonWithWarning>
      </>
    </ContentMenu>
  );
};
