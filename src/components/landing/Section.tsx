import { ArrowDown, ArrowUp, Trash } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import {
  ContentMenuButton,
  ContentMenuContainer,
  ContentMenuVerticalBar,
} from "^components/menus/Content";
import WithWarning from "^components/WithWarning";
import {
  LandingSectionProvider,
  useLandingSectionContext,
} from "^context/landing/LandingSectionContext";

import { useSelector } from "^redux/hooks";
import { selectById, selectTotal } from "^redux/state/landing";
import Sections from "./Sections";

export default function Section({
  children,
  id,
}: {
  children: ReactElement;
  id: string;
}) {
  const section = useSelector((state) => selectById(state, id))!;

  return (
    <LandingSectionProvider section={section}>
      {children}
    </LandingSectionProvider>
  );
}

Section.Menu = function SectionMenu({
  extraButtons,
}: {
  extraButtons?: ReactElement | null;
}) {
  const [{ index }] = useLandingSectionContext();
  const sectionHoveredIndex = Sections.useContext();

  const sectionIsHovered = index === sectionHoveredIndex;

  return (
    <ContentMenuContainer
      show={sectionIsHovered}
      styles={tw`right-0 top-xs -translate-y-full`}
    >
      <>
        {extraButtons ? extraButtons : null}
        <MoveSectionDownButton />
        <MoveSectionUpButton />
        <ContentMenuVerticalBar />
        <DeleteSectionButton />
      </>
    </ContentMenuContainer>
  );
};

const MoveSectionDownButton = () => {
  const numSections = useSelector(selectTotal);
  const [{ index }, { moveSection }] = useLandingSectionContext();

  const canMoveDown = index < numSections - 1;

  return (
    <ContentMenuButton
      isDisabled={!canMoveDown}
      onClick={() => moveSection({ direction: "down" })}
      tooltipProps={{ text: "move section down", type: "action" }}
    >
      <ArrowDown />
    </ContentMenuButton>
  );
};

const MoveSectionUpButton = () => {
  const [{ index }, { moveSection }] = useLandingSectionContext();

  const canMoveUp = index > 0;

  return (
    <ContentMenuButton
      isDisabled={!canMoveUp}
      onClick={() => moveSection({ direction: "up" })}
      tooltipProps={{ text: "move section up", type: "action" }}
    >
      <ArrowUp />
    </ContentMenuButton>
  );
};

const DeleteSectionButton = () => {
  const [, { removeOne }] = useLandingSectionContext();

  return (
    <WithWarning
      callbackToConfirm={removeOne}
      warningText={{ heading: "Delete section?" }}
    >
      <ContentMenuButton
        tooltipProps={{ text: "delete section", type: "action" }}
      >
        <Trash />
      </ContentMenuButton>
    </WithWarning>
  );
};
