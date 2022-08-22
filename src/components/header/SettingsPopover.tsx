import { Gear, Trash } from "phosphor-react";
import { createContext, ReactElement, useContext } from "react";
import tw from "twin.macro";
import WithProximityPopover from "^components/WithProximityPopover";

import WithWarning from "^components/WithWarning";
import { checkObjectHasField } from "^helpers/general";

import { s_menu } from "^styles/menus";
import { s_popover } from "^styles/popover";
import Header from "./Header";

type Props = {
  deleteDocFunc: () => void;
  docType: string;
};

type ComponentContextValue = Props;
const ComponentContext = createContext<ComponentContextValue>(
  {} as ComponentContextValue
);

const ComponentProvider = ({
  children,
  ...value
}: {
  children: ReactElement;
} & ComponentContextValue) => {
  return (
    <ComponentContext.Provider value={value}>
      {children}
    </ComponentContext.Provider>
  );
};

const useComponentContext = () => {
  const context = useContext(ComponentContext);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useComponentContext must be used within its provider!");
  }
  return context;
};

const SettingsPopover = (props: Props) => {
  return (
    <WithProximityPopover
      panel={
        <ComponentProvider {...props}>
          <Panel />
        </ComponentProvider>
      }
    >
      <Header.IconButton tooltip="settings">
        <Gear />
      </Header.IconButton>
    </WithProximityPopover>
  );
};

export default SettingsPopover;

const Panel = () => {
  const { deleteDocFunc, docType } = useComponentContext();
  return (
    <div css={[s_popover.panelContainer, tw`py-xs min-w-[25ch]`]}>
      <WithWarning
        callbackToConfirm={() => deleteDocFunc()}
        warningText={{
          heading: `Delete ${docType}`,
          body: `Are you sure you want to delete this ${docType}? This can't be undone.`,
        }}
      >
        <button
          className="group"
          css={[
            s_menu.listItemText,
            tw`w-full text-left px-sm py-xs flex gap-sm items-center transition-colors ease-in-out duration-75`,
          ]}
        >
          <span css={[tw`group-hover:text-red-warning`]}>
            <Trash />
          </span>
          <span>Delete {docType}</span>
        </button>
      </WithWarning>
    </div>
  );
};
