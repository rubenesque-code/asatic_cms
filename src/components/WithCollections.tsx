import {
  ChangeEvent,
  createContext,
  Dispatch,
  FormEvent,
  ReactElement,
  SetStateAction,
  useContext,
  useState,
} from "react";
import tw from "twin.macro";
import {
  ArrowElbowDownRight as ArrowElbowDownRightIcon,
  Books as BooksIcon,
  FileMinus,
  FilePlus,
  Plus,
  Translate,
  WarningCircle,
} from "phosphor-react";
import { v4 as generateUId } from "uuid";

import { useSelector, useDispatch } from "^redux/hooks";
import {
  selectAll,
  addOne,
  selectById as selectCollectionById,
  addTranslation,
  updateText,
} from "^redux/state/collections";
import { selectById as selectLanguageById } from "^redux/state/languages";
import { selectById as selectSubjectById } from "^redux/state/subjects";

import useFocused from "^hooks/useFocused";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";
import InlineTextEditor from "./editors/Inline";
import LanguageError from "./LanguageError";
import MissingText from "./MissingText";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import {
  Collection as CollectionType,
  CollectionTranslation as CollectionTranslationType,
} from "^types/collection";
import {
  CollectionProvider,
  useCollectionContext,
} from "^context/CollectionContext";
import { fuzzySearchCollections } from "^helpers/collections";
import { SubjectProvider } from "^context/SubjectContext";
import WithDocSubjects from "./WithSubjects";

type TopProps = {
  docActiveLanguageId: string;
  docCollectionsById: string[];
  docLanguagesById: string[];
  onAddCollectionToDoc: (collectionId: string) => void;
  onRemoveCollectionFromDoc: (collectionId: string) => void;
};

type Value = TopProps;
const Context = createContext<Value>({} as Value);

const Provider = ({
  children,
  ...value
}: { children: ReactElement } & Value) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useWithCollectionsContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useWithCollectionsContext must be used within its provider!"
    );
  }
  return context;
};

const WithCollections = ({
  children,
  ...topProps
}: {
  children: ReactElement;
} & TopProps) => {
  return (
    <WithProximityPopover
      panelContentElement={
        <Provider {...topProps}>
          <Panel />
        </Provider>
      }
      panelMaxWidth={tw`max-w-[80vw]`}
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithCollections;

const Panel = () => {
  const { docCollectionsById } = useWithCollectionsContext();

  const areDocCollections = Boolean(docCollectionsById.length);

  return <PanelUI areDocCollections={areDocCollections} />;
};

const PanelUI = ({ areDocCollections }: { areDocCollections: boolean }) => (
  <div css={[s_popover.panelContainer]}>
    <div>
      <h4 css={[tw`font-medium text-lg`]}>Collections</h4>
      <p css={[tw`text-gray-600 mt-xs text-sm`]}>
        Collections allow groups of content to be grouped under a topic (rather
        than a subject, which is broader). You can optionally relate a
        collection to a subject(s).
      </p>
      {!areDocCollections ? (
        <p css={[tw`text-gray-800 mt-xs text-sm`]}>None yet.</p>
      ) : null}
    </div>
    <div css={[tw`flex flex-col gap-lg items-start`]}>
      <List />
      {/* <InputWithSelect /> */}
    </div>
  </div>
);

const List = () => {
  const { docCollectionsById } = useWithCollectionsContext();

  return (
    <ListUI
      listItems={docCollectionsById.map((docCollectionId, i) => (
        <ListItem
          docCollectionId={docCollectionId}
          index={i}
          key={docCollectionId}
        />
      ))}
    />
  );
};

const ListUI = ({ listItems }: { listItems: ReactElement[] }) => (
  <div css={[tw`flex flex-col gap-md`]}>{listItems}</div>
);

const ListItem = ({
  docCollectionId,
  index,
}: {
  docCollectionId: string;
  index: number;
}) => {
  const number = index + 1;

  return (
    <ListItemUI
      collection={<HandleCollection docCollectionId={docCollectionId} />}
      number={number}
    />
  );
};

const ListItemUI = ({
  collection,
  number,
}: {
  collection: ReactElement;
  number: number;
}) => {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
      {collection}
    </div>
  );
};

const HandleCollection = ({ docCollectionId }: { docCollectionId: string }) => {
  const collection = useSelector((state) =>
    selectCollectionById(state, docCollectionId)
  );

  return collection ? (
    <CollectionProvider collection={collection}>
      <ValidCollection />
    </CollectionProvider>
  ) : (
    <InvalidCollection docCollectionId={docCollectionId} />
  );
};

const InvalidCollection = ({
  docCollectionId,
}: {
  docCollectionId: string;
}) => {
  return (
    <InvalidCollectionUI
      removeFromDocButton={
        <RemoveFromDocButton docCollectionId={docCollectionId} />
      }
    />
  );
};

const InvalidCollectionUI = ({
  removeFromDocButton,
}: {
  removeFromDocButton: ReactElement;
}) => (
  <div css={[tw`flex items-center gap-sm`]}>
    {removeFromDocButton}
    <WithTooltip
      text={{
        header: "Collection error",
        body: "A collection was added to this document that can't be found. Try refreshing the page. If the problem persists, contact the site developer.",
      }}
    >
      <span css={[tw`text-red-500 bg-white group-hover:z-50`]}>
        <WarningCircle />
      </span>
    </WithTooltip>
  </div>
);

const RemoveFromDocButton = ({
  docCollectionId,
}: {
  docCollectionId: string;
}) => {
  const { onRemoveCollectionFromDoc } = useWithCollectionsContext();

  const removeFromDoc = () => onRemoveCollectionFromDoc(docCollectionId);

  return (
    <RemoveFromDocButtonUI
      removeFromDoc={removeFromDoc}
      tooltipText="remove collection from document"
      warningText="Remove collection from document?"
    />
  );
};

const RemoveFromDocButtonUI = ({
  removeFromDoc,
  tooltipText,
  warningText,
}: {
  removeFromDoc: () => void;
  tooltipText: string;
  warningText: string;
}) => {
  return (
    <WithWarning
      callbackToConfirm={removeFromDoc}
      warningText={{ heading: warningText }}
      type="moderate"
    >
      {({ isOpen: warningIsOpen }) => (
        <WithTooltip
          text={tooltipText}
          placement="top"
          isDisabled={warningIsOpen}
          type="action"
        >
          <button
            css={[
              tw`text-gray-600 p-xxs hover:bg-gray-100 hover:text-red-warning active:bg-gray-200 rounded-full grid place-items-center`,
            ]}
            type="button"
          >
            <FileMinus />
          </button>
        </WithTooltip>
      )}
    </WithWarning>
  );
};

const ValidCollection = () => {
  return <CollectionUI />;
};

const CollectionUI = () => <div>Collection</div>;
