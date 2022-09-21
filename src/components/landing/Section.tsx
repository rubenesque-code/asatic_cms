import { ArrowDown, ArrowUp, Trash } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectById, selectTotal } from "^redux/state/landing";

import LandingSectionSlice from "^context/landing/LandingSectionContext";

import AutoSection from "./auto-section/AutoSection";
import ContentMenu from "^components/menus/Content";
import ContainerUtility from "^components/ContainerUtilities";

export default function LandingSection({ id }: { id: string }) {
  const section = useSelector((state) => selectById(state, id))!;

  return (
    <LandingSectionSlice.Provider section={section}>
      <ContainerUtility.isHovered>
        {(isHovered) => (
          <>
            {section.type === "auto" ? (
              <AutoSection />
            ) : (
              <div>CUSTOM SECTION</div>
            )}
            <LandingSection.Menu isShowing={isHovered} />
          </>
        )}
      </ContainerUtility.isHovered>
    </LandingSectionSlice.Provider>
  );
}

LandingSection.Menu = function SectionMenu({
  extraButtons,
  isShowing,
}: {
  extraButtons?: ReactElement | null;
  isShowing: boolean;
}) {
  return (
    <ContentMenu show={isShowing} styles={tw`right-0 top-xs -translate-y-full`}>
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
  const [{ index }, { moveSection }] = LandingSectionSlice.useContext();

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
  const [{ index }, { moveSection }] = LandingSectionSlice.useContext();

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
  const [, { removeOne }] = LandingSectionSlice.useContext();

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
