import { createContext, ReactElement, useContext } from "react";
import WithProximityPopover from "^components/WithProximityPopover";
import { checkObjectHasField } from "^helpers/general";
import UI from "./UI";
import ArticleTable from "^components/articles/articles-page/Table";
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

const AddPrimaryContent = ({
  children: button,
  contextValue,
}: {
  children: ReactElement;
  contextValue: ComponentContextValue;
}) => {
  return (
    <WithProximityPopover
      panel={
        <ComponentProvider contextValue={contextValue}>
          <Panel />
        </ComponentProvider>
      }
    >
      {button}
    </WithProximityPopover>
  );
};

export default AddPrimaryContent;

const Panel = () => {
  const { docType } = useComponentContext();

  return (
    <UI.Panel>
      <UI.DescriptionContainer>
        <UI.Title>Add Content</UI.Title>
        <UI.Description>Add content to this {docType}.</UI.Description>
      </UI.DescriptionContainer>
      <div>
        <FilterProviders>
          <>
            <FiltersUI>
              <>
                <LanguageSelect.Select />
                <DocsQuery.InputCard />
              </>
            </FiltersUI>
            <Articles />
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

const Articles = () => {
  return (
    <div>
      <h3>Articles</h3>
      <ArticleTable />
    </div>
  );
};
