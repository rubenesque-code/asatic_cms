import { ArrowDown, ArrowUp, Trash } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById, selectTotal } from "^redux/state/landing";

import {
  LandingSectionProvider,
  useLandingSectionContext,
} from "^context/landing/LandingSectionContext";

import AutoSection from "./auto-section/AutoSection";
import Sections from "./Sections";
import ContentMenu from "^components/menus/Content";

export default function Section({ id }: { id: string }) {
  const section = useSelector((state) => selectById(state, id))!;

  return (
    <LandingSectionProvider section={section}>
      {section.type === "auto" ? <AutoSection /> : <div>CUSTOM SECTION</div>}
    </LandingSectionProvider>
  );
}

Section.useContext = useLandingSectionContext;

Section.Menu = function SectionMenu({
  extraButtons,
}: {
  extraButtons?: ReactElement | null;
}) {
  const [{ index }] = useLandingSectionContext();
  const sectionHoveredIndex = Sections.useContext();

  const sectionIsHovered = index === sectionHoveredIndex;

  return (
    <ContentMenu
      show={sectionIsHovered}
      styles={tw`right-0 top-xs -translate-y-full`}
    >
      <>
        {extraButtons ? extraButtons : null}
        <MoveSectionDownButton />
        <MoveSectionUpButton />
        <ContentMenu.VerticalBar />
        <DeleteSectionButton />
      </>
    </ContentMenu>
  );
};

const MoveSectionDownButton = () => {
  const numSections = useSelector(selectTotal);
  const [{ index }, { moveSection }] = Section.useContext();

  const canMoveDown = index < numSections - 1;

  return (
    <ContentMenu.Button
      isDisabled={!canMoveDown}
      onClick={() => moveSection({ direction: "down" })}
      tooltipProps={{ text: "move section down", type: "action" }}
    >
      <ArrowDown />
    </ContentMenu.Button>
  );
};

const MoveSectionUpButton = () => {
  const [{ index }, { moveSection }] = Section.useContext();

  const canMoveUp = index > 0;

  return (
    <ContentMenu.Button
      isDisabled={!canMoveUp}
      onClick={() => moveSection({ direction: "up" })}
      tooltipProps={{ text: "move section up", type: "action" }}
    >
      <ArrowUp />
    </ContentMenu.Button>
  );
};

const DeleteSectionButton = () => {
  const [, { removeOne }] = Section.useContext();

  return (
    <ContentMenu.ButtonWithWarning
      tooltipProps={{ text: "delete section", type: "action" }}
      warningProps={{
        callbackToConfirm: removeOne,
        warningText: { heading: "Delete section?" },
      }}
    >
      <Trash />
    </ContentMenu.ButtonWithWarning>
  );
};
