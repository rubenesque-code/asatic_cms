import { ArrowDown, ArrowUp, Trash } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";

// import WithWarning from "^components/WithWarning";
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
  const [{ index }, { moveSection }] = useLandingSectionContext();

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
  const [{ index }, { moveSection }] = useLandingSectionContext();

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
  const [, { removeOne }] = useLandingSectionContext();

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
