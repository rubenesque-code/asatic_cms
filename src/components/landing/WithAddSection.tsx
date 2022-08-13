import {
  DiceFour,
  FilePlus as FilePlusIcon,
  Robot as RobotIcon,
  User as UserIcon,
  Wrench,
} from "phosphor-react";
import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";

import { useDispatch, useSelector } from "^redux/hooks";
import { addOne, selectAll } from "^redux/state/landing";

import { LandingSectionAuto } from "^types/landing";

import UserCreatedIcon from "^components/icons/UserCreated";
import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";

import { s_editorMenu } from "^styles/menus";
import { s_popover } from "^styles/popover";
import {
  ContentMenuButton,
  ContentMenuContainer,
} from "^components/menus/Content";
import { checkObjectHasField } from "^helpers/general";

type ContextValue = { newSectionIndex: number };
const Context = createContext<ContextValue>({} as ContextValue);

const ComponentProvider = ({
  children,
  ...value
}: { children: ReactElement } & ContextValue) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useComponentContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

const WithAddLandingSectionPopover = ({
  children,
  ...contextProps
}: {
  children: ReactElement;
} & ContextValue) => {
  return (
    <WithProximityPopover
      panel={
        <ComponentProvider {...contextProps}>
          <Panel />
        </ComponentProvider>
      }
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithAddLandingSectionPopover;

const Panel = () => {
  return (
    <ContentMenuContainer show={true}>
      <AddUserCreatedSectionButton />
    </ContentMenuContainer>
  );
};

const AddUserCreatedSectionButton = () => {
  const { newSectionIndex } = useComponentContext();

  const dispatch = useDispatch();

  const addUserCreatedSection = () =>
    dispatch(addOne({ type: "custom", index: newSectionIndex }));

  return (
    <ContentMenuButton
      onClick={addUserCreatedSection}
      tooltipProps={{
        text: {
          header: "user-created",
          body: "Add any type of document and edit its size.",
        },
        type: "action",
      }}
    >
      <UserIcon />
    </ContentMenuButton>
  );
};

const WithAddSection = ({
  children,
  newSectionIndex,
}: {
  children: ReactElement;
  newSectionIndex: number;
}) => {
  const dispatch = useDispatch();
  const addUserCreatedSection = (
    contentType: LandingSectionAuto["contentType"]
  ) => dispatch(addOne({ contentType, newSectionIndex, type: "custom" }));

  return (
    <WithProximityPopover
      panel={({ close: closePanel }) => (
        <AddSectionPanelUI
          addAutoCreatedButton={
            <AddAutoCreatedPopover
              closePanel={closePanel}
              positionNum={newSectionIndex}
            />
          }
          addUserCreated={addUserCreatedSection}
        />
      )}
    >
      {children}
    </WithProximityPopover>
  );
};

const AddSectionPanelUI = ({
  addAutoCreatedButton,
  addUserCreated,
}: {
  addUserCreated: (contentType: LandingSectionAuto["contentType"]) => void;
  addAutoCreatedButton: ReactElement;
}) => {
  return (
    <div
      css={[
        tw`px-sm py-xs flex items-center gap-md bg-white rounded-md shadow-md border`,
      ]}
    >
      <WithTooltip
        text={{
          header: "user-created",
          body: "Add any type of document and edit its size.",
        }}
        type="action"
      >
        <button css={[s_editorMenu.button.button, tw`relative`]} type="button">
          <UserCreatedIcon />
        </button>
      </WithTooltip>
      {addAutoCreatedButton}
    </div>
  );
};

const AddAutoCreatedPopover = ({
  closePanel,
  positionNum,
}: {
  closePanel: () => void;
  positionNum: number;
}) => {
  return (
    <WithProximityPopover
      panel={
        <AddAutoCreatedPanel
          closePanel={closePanel}
          positionNum={positionNum}
        />
      }
      placement="bottom-start"
    >
      <WithTooltip
        text={{
          header: "auto-generated",
          body: "Choose from document types, e.g. articles, and a swipeable section will be created.",
        }}
      >
        <button css={[s_editorMenu.button.button, tw`relative`]} type="button">
          <span>
            <RobotIcon />
          </span>
          <span css={[tw`absolute bottom-0.5 -right-1 text-xs text-gray-800`]}>
            <Wrench />
          </span>
        </button>
      </WithTooltip>
    </WithProximityPopover>
  );
};

const contentSectionData: {
  contentType: LandingSectionAuto["contentType"];
  text: string;
}[] = [
  {
    contentType: "article",
    text: "articles",
  },
];

const AddAutoCreatedPanel = ({
  closePanel,
  positionNum,
}: {
  closePanel: () => void;
  positionNum: number;
}) => {
  const sections = useSelector(selectAll);
  const autoSections = sections.filter(
    (s) => s.type === "auto"
  ) as LandingSectionAuto[];

  const sectionIsUsed = (contentType: LandingSectionAuto["contentType"]) => {
    const usedAutoSectionsTypes = autoSections.map((s) => s.contentType);

    const isUsed = usedAutoSectionsTypes.includes(contentType);

    return isUsed;
  };

  const dispatch = useDispatch();

  const addAutoSection = (contentType: LandingSectionAuto["contentType"]) => {
    dispatch(
      addOne({ type: "auto", contentType, newSectionIndex: positionNum })
    );
    closePanel();
  };

  return (
    <AddAutoCreatedPanelUI
      addSectionButtons={
        <>
          {contentSectionData.map((s) => (
            <AddAutoCreatedSectionUI
              addToLanding={() => addAutoSection(s.contentType)}
              isUsed={sectionIsUsed(s.contentType)}
              text={s.text}
              key={s.contentType}
            />
          ))}
        </>
      }
    />
  );
};

const AddAutoCreatedPanelUI = ({
  addSectionButtons,
}: {
  addSectionButtons: ReactElement;
}) => {
  return (
    <div
      css={[
        tw`text-left py-sm flex flex-col gap-md bg-white rounded-md shadow-md border`,
      ]}
    >
      {addSectionButtons}
    </div>
  );
};

const AddAutoCreatedSectionUI = ({
  addToLanding,
  isUsed,
  text,
}: {
  addToLanding: () => void;
  isUsed: boolean;
  text: string;
}) => {
  return (
    <button
      css={[
        tw`flex items-center gap-sm py-0.5 px-md text-gray-700`,
        isUsed && tw`cursor-auto text-gray-400`,
      ]}
      onClick={() => !isUsed && addToLanding()}
      type="button"
    >
      <span css={[tw`whitespace-nowrap`]}>{text}</span>
      <span>
        <FilePlusIcon />
      </span>
    </button>
  );
};
