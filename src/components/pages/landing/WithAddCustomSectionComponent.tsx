import { ReactElement } from "react";
import tw from "twin.macro";
import ContentInputWithSelect from "^components/ContentInputWithSelect";
import WithProximityPopover from "^components/WithProximityPopover";
import useSearchLandingContent from "^hooks/pages/useLandingContent";
import { s_popover } from "^styles/popover";
import { LandingSectionCustom } from "^types/landing";

const WithAddCustomSectionComponent = ({
  children,
  addComponent,
}: {
  children: ReactElement;
  addComponent: ({
    docId,
    type,
  }: {
    docId: string;
    type: LandingSectionCustom["components"][number]["type"];
  }) => void;
}) => {
  return (
    <WithProximityPopover
      panelContentElement={({ close: closePanel }) => (
        <AddCustomSectionSectionPanelUI
          contentSearch={
            <ContentSearch
              addComponent={addComponent}
              closePanel={closePanel}
            />
          }
        />
      )}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithAddCustomSectionComponent;

const AddCustomSectionSectionPanelUI = ({
  contentSearch,
}: {
  contentSearch: ReactElement;
}) => {
  return (
    <div css={[s_popover.panelContainer, tw`text-left`]}>
      <div>
        <h4 css={[s_popover.title]}>Add content</h4>
        <p css={[s_popover.subTitleText]}>
          Search by document type, title, author, tag, language or other text
          within document.
        </p>
      </div>
      <div css={[tw`self-stretch`]}>{contentSearch}</div>
    </div>
  );
};

const ContentSearch = ({
  closePanel,
  addComponent,
}: {
  closePanel: () => void;
  addComponent: ({
    docId,
    type,
  }: {
    docId: string;
    type: LandingSectionCustom["components"][number]["type"];
  }) => void;
}) => {
  const landingContent = useSearchLandingContent();

  const handleAddComponent = (args: Parameters<typeof addComponent>[0]) => {
    addComponent(args);
    closePanel();
  };

  return (
    <ContentInputWithSelect
      onSubmit={handleAddComponent}
      usedArticlesById={landingContent.articles}
    />
  );
};
