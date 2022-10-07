import { X } from "phosphor-react";
import { ReactElement } from "react";

import DocsQuery from "^components/DocsQuery";
import FiltersUI from "^components/FiltersUI";
import LanguageSelect from "^components/LanguageSelect";
import ContentMenu from "^components/menus/Content";

import { useComponentContext } from "../Context";
import Table from "../table";
import {
  $CloseButtonContainer,
  $CloseButtonIcon,
  $Container,
  $Description,
  $FiltersAndTableContainer,
  $Meta,
  $Title,
  $TableContainer,
} from "./styles";

const Panel = (closePopoverProp: { closePopover: () => void }) => {
  const { addEntityTo } = useComponentContext();

  return (
    <$Container>
      <CloseButton {...closePopoverProp} />
      <$Meta>
        <$Title>Add Content</$Title>
        <$Description>Add content to {addEntityTo}</$Description>
      </$Meta>
      <$FiltersAndTableContainer>
        <FilterProviders>
          <>
            <Filters />
            <$TableContainer>
              <Table {...closePopoverProp} />
            </$TableContainer>
          </>
        </FilterProviders>
      </$FiltersAndTableContainer>
    </$Container>
  );
};

export default Panel;

const CloseButton = ({ closePopover }: { closePopover: () => void }) => {
  return (
    <$CloseButtonContainer>
      <ContentMenu.Button
        onClick={closePopover}
        tooltipProps={{ text: "close panel" }}
      >
        <$CloseButtonIcon>
          <X />
        </$CloseButtonIcon>
      </ContentMenu.Button>
    </$CloseButtonContainer>
  );
};

const Filters = () => {
  return (
    <FiltersUI marginLeft={false}>
      <>
        <LanguageSelect.Select />
        <DocsQuery.InputCard />
      </>
    </FiltersUI>
  );
};

const FilterProviders = ({ children }: { children: ReactElement }) => {
  return (
    <DocsQuery.Provider>
      <LanguageSelect.Provider>{children}</LanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};
