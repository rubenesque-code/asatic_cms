import {
  FilePlus as FilePlusIcon,
  Robot as RobotIcon,
  Wrench,
} from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import { useDispatch, useSelector } from "^redux/hooks";
import { addOne, selectAll } from "^redux/state/landing";

import { LandingSectionAuto } from "^types/landing";

import UserCreatedIcon from "^components/icons/UserCreated";
import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";

import { s_editorMenu } from "^styles/menus";

const WithAddSection = ({
  children,
  sectionToAddIndex,
}: {
  children: ReactElement;
  sectionToAddIndex: number;
}) => {
  const dispatch = useDispatch();
  const addUserCreatedSection = () =>
    dispatch(addOne({ newSectionIndex: sectionToAddIndex, type: "custom" }));

  return (
    <WithProximityPopover
      panel={({ close: closePanel }) => (
        <AddSectionPanelUI
          addAutoCreatedButton={
            <AddAutoCreatedPopover
              closePanel={closePanel}
              positionNum={sectionToAddIndex}
            />
          }
          addUserCreated={() => {
            addUserCreatedSection();
            closePanel();
          }}
        />
      )}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithAddSection;

const AddSectionPanelUI = ({
  addAutoCreatedButton,
  addUserCreated,
}: {
  addUserCreated: () => void;
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
        <button
          css={[s_editorMenu.button.button, tw`relative`]}
          onClick={addUserCreated}
          type="button"
        >
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
