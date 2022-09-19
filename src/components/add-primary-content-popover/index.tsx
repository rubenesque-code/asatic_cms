import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";

import { checkObjectHasField } from "^helpers/general";

import UI from "./UI";

import Popover from "^components/ProximityPopover";
import ArticleTable from "^components/articles/ArticlesTable";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";
import FiltersUI from "^components/FiltersUI";

type ComponentContextValue = { docType: string };
const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

const ComponentProvider = ({
  children,
  contextValue,
}: {
  children: ReactElement;
  contextValue: ComponentContextValue;
}) => {
  return (
    <ComponentContext.Provider value={contextValue}>
      {children}
    </ComponentContext.Provider>
  );
};

// todo: articles table doesn't quite work: e.g. hase delete mutation stuff
const useComponentContext = () => {
  const context = useContext(ComponentContext);
  // console.log('context:', context)
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

function PrimaryContentPopover({
  children: button,
  contextValue,
}: {
  children: ReactElement;
  contextValue: ComponentContextValue;
}) {
  return (
    <Popover>
      {({ isOpen }) => (
        <>
          <Popover.Panel isOpen={isOpen}>
            <ComponentProvider contextValue={contextValue}>
              <Panel />
            </ComponentProvider>
          </Popover.Panel>
          {button}
        </>
      )}
    </Popover>
  );
}

export default PrimaryContentPopover;

const Panel = () => {
  const { docType } = useComponentContext();

  return (
    <UI.Panel>
      <UI.DescriptionContainer>
        <UI.Title>Add Content</UI.Title>
        <UI.Description>Add content to this {docType}.</UI.Description>
      </UI.DescriptionContainer>
      <div css={[tw`mt-md`]}>
        <FilterProviders>
          <>
            <FiltersUI marginLeft={false}>
              <>
                <LanguageSelect.Select />
                <DocsQuery.InputCard />
              </>
            </FiltersUI>
            <Documents />
          </>
        </FilterProviders>
      </div>
    </UI.Panel>
  );
};

const FilterProviders = ({ children }: { children: ReactElement }) => {
  return (
    <DocsQuery.Provider>
      <LanguageSelect.Provider>{children}</LanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

const Documents = () => {
  return (
    <div>
      <Articles />
    </div>
  );
};

const Articles = () => {
  return (
    <div>
      <h3>Articles</h3>
      <ArticleTable includeActions={false} />
    </div>
  );
};

PrimaryContentPopover.Button = Popover.Button;
