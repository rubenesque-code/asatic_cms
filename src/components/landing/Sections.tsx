import {
  createContext,
  Fragment,
  ReactElement,
  useContext,
  useState,
} from "react";
import {
  PlusCircle,
  CaretDown,
  PlusCircle as PlusCircleIcon,
  SquaresFour as SquaresFourIcon,
} from "phosphor-react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectIds } from "^redux/state/landing";

import { checkObjectHasField } from "^helpers/general";

import WithAddLandingSectionPopover from "./WithAddSectionPopover";
import WithTooltip from "^components/WithTooltip";

import s_transition from "^styles/transition";
import Section from "./Section";

type ContextValue = [
  data: {
    sectionHoveredIndex: number | null;
  },
  actions: {
    setSectionHoveredIndex: (index: number | null) => void;
  }
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

function SectionsProvider({
  children,
}: {
  children: ({
    sectionHoveredIndex,
  }: {
    sectionHoveredIndex: number | null;
  }) => ReactElement;
}) {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<number | null>(
    null
  );

  return (
    <Context.Provider
      value={[{ sectionHoveredIndex }, { setSectionHoveredIndex }]}
    >
      {children({ sectionHoveredIndex })}
    </Context.Provider>
  );
}

const useSectionsContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useSectionsContext must be used within its provider!");
  }

  return context;
};

Sections.useContext = function useSectionsContext() {
  const [{ sectionHoveredIndex }] = useContext(Context);
  const contextIsPopulated =
    typeof sectionHoveredIndex === "number" || sectionHoveredIndex === null;
  if (!contextIsPopulated) {
    throw new Error("useSectionsContext must be used within its provider!");
  }

  return sectionHoveredIndex;
};

export default function Sections({
  sectionComponent,
}: {
  sectionComponent: ReactElement;
}) {
  const sectionsIds = useSelector(selectIds) as string[];

  return (
    <SectionsProvider>
      {({ sectionHoveredIndex }) => (
        <>
          <AddSectionMenu
            newSectionIndex={0}
            adjacentSectionIsHovered={sectionHoveredIndex === 0}
          />
          {sectionsIds.map((sectionId, i) => (
            <Fragment key={sectionId}>
              <SectionContainer index={i}>
                <Section id={sectionId}>{sectionComponent}</Section>
              </SectionContainer>
              <AddSectionMenu
                newSectionIndex={i + 1}
                adjacentSectionIsHovered={
                  sectionHoveredIndex === i || sectionHoveredIndex === i + 1
                }
              />
            </Fragment>
          ))}
        </>
      )}
    </SectionsProvider>
  );
}

function SectionContainer({
  children,
  index,
}: {
  children: ReactElement;
  index: number;
}) {
  const [, { setSectionHoveredIndex }] = useSectionsContext();

  return (
    <div
      onMouseEnter={() => setSectionHoveredIndex(index)}
      onMouseLeave={() => setSectionHoveredIndex(null)}
    >
      {children}
    </div>
  );
}

function AddSectionMenu({
  newSectionIndex,
  adjacentSectionIsHovered,
}: {
  newSectionIndex: number;
  adjacentSectionIsHovered: boolean;
}) {
  return (
    <div
      css={[
        tw`relative z-30 hover:z-40 h-[10px]`,
        s_transition.toggleVisiblity(adjacentSectionIsHovered),
        tw`opacity-40 hover:visible hover:opacity-100`,
      ]}
    >
      <div
        css={[tw`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`]}
      >
        <WithAddLandingSectionPopover newSectionIndex={newSectionIndex}>
          <WithTooltip text="add section here" type="action">
            <button
              css={[
                tw`rounded-full bg-transparent hover:bg-white text-gray-400 hover:scale-125 transition-all ease-in duration-75 hover:text-green-active`,
              ]}
              type="button"
            >
              <PlusCircle />
            </button>
          </WithTooltip>
        </WithAddLandingSectionPopover>
      </div>
    </div>
  );
}

Sections.Empty = function SectionsEmpty() {
  return (
    <div css={[tw`text-center`]}>
      <div css={[tw` relative text-gray-300 inline-flex items-center`]}>
        <span css={[tw`text-4xl`]}>
          <SquaresFourIcon weight="thin" />
        </span>
        <span css={[tw`absolute bottom-0.5 right-0.5 bg-white`]}>
          <PlusCircleIcon />
        </span>
      </div>
      <p css={[tw`mt-sm text-gray-600`]}>
        Get started building the landing page.
      </p>
      <WithAddLandingSectionPopover newSectionIndex={0}>
        <button
          css={[
            tw`mt-lg inline-flex items-center gap-xxs border rounded-md py-1.5 px-3`,
          ]}
          className="group"
          type="button"
        >
          <span css={[tw`uppercase text-xs text-gray-700`]}>add section</span>
          <span
            css={[
              tw`p-xxxs group-hover:bg-gray-50 group-active:bg-gray-100 rounded-full transition-colors duration-75 ease-in-out text-gray-500 text-xs`,
            ]}
          >
            <CaretDown />
          </span>
        </button>
      </WithAddLandingSectionPopover>
    </div>
  );
};
