import { ReactElement } from "react";
import tw from "twin.macro";
import {
  ArrowsInLineHorizontal,
  ArrowsOutLineHorizontal,
  CaretDown,
  Plus,
  Trash,
} from "phosphor-react";

import LandingSectionSlice from "^context/landing/LandingSectionContext";
import LandingCustomSectionSlice from "^context/landing/LandingCustomSectionContext";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import { sortComponents, mapIds } from "^helpers/general";

import { LandingSectionCustom } from "^types/landing";

import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import ContentMenu from "^components/menus/Content";
import ContainerUtility from "^components/ContainerUtilities";

import AddContentPopover from "./AddContentPopover";
import CustomSectionUI from "./CustomSectionUI";
import Article from "./Article";
import Blog from "./Blog";
import RecordedEvent from "./RecordedEvent";
import LandingSection from "../Section";

const CustomSection = () => {
  const [section] = LandingSectionSlice.useContext();
  const sectionAsserted = section as LandingSectionCustom;
  const { components } = sectionAsserted;

  return (
    <LandingCustomSectionSlice.Provider section={sectionAsserted}>
      <ContainerUtility.isHovered>
        {(isHovered) => (
          <>
            {components.length ? <Content /> : <NoContent />}
            <SectionMenu isShowing={isHovered} />
            {/* <AddSectionMenu isShowing={isHovered} /> */}
          </>
        )}
      </ContainerUtility.isHovered>
    </LandingCustomSectionSlice.Provider>
  );
};

export default CustomSection;

const SectionMenu = ({ isShowing }: { isShowing: boolean }) => {
  return (
    <LandingSection.Menu
      extraButtons={
        <>
          <AddContentPopover>
            <AddContentPopover.Button>
              <ContentMenu.Button
                tooltipProps={{ text: "add content to section" }}
              >
                <Plus />
              </ContentMenu.Button>
            </AddContentPopover.Button>
          </AddContentPopover>
          <ContentMenu.VerticalBar />
        </>
      }
      isShowing={isShowing}
    />
  );
};

const NoContent = () => {
  return (
    <div css={[tw`min-h-[300px] grid place-items-center border`]}>
      <div css={[tw`flex flex-col items-center`]}>
        <p css={[tw`text-gray-600`]}>No content yet for this custom section.</p>
        <AddContentPopover>
          <AddContentPopover.Button>
            <button
              css={[
                tw`mt-lg inline-flex items-center gap-xxs border rounded-md py-1.5 px-3`,
              ]}
              className="group"
              type="button"
            >
              <span css={[tw`uppercase text-xs text-gray-700`]}>
                add component
              </span>
              <span
                css={[
                  tw`p-xxxs group-hover:bg-gray-50 group-active:bg-gray-100 rounded-full transition-colors duration-75 ease-in-out text-gray-500 text-xs`,
                ]}
              >
                <CaretDown />
              </span>
            </button>
          </AddContentPopover.Button>
        </AddContentPopover>
      </div>
    </div>
  );
};

const Content = () => {
  const [{ id: sectionId, components }, { reorderCustomSection }] =
    LandingCustomSectionSlice.useContext();

  const componentsOrdered = sortComponents(components);

  return (
    <CustomSectionUI>
      <DndSortableContext
        elementIds={mapIds(componentsOrdered)}
        onReorder={reorderCustomSection}
      >
        {componentsOrdered.map((component) => (
          <DndSortableElement
            colSpan={component.width}
            elementId={component.id}
            key={component.id}
          >
            <LandingCustomSectionComponentSlice.Provider
              component={component}
              sectionId={sectionId}
            >
              <Component />
            </LandingCustomSectionComponentSlice.Provider>
          </DndSortableElement>
        ))}
      </DndSortableContext>
    </CustomSectionUI>
  );
};

const Component = () => {
  return (
    <div css={[tw`relative h-full min-h-[350px] border`]}>
      <ComponentTypeSwitch />
    </div>
  );
};

const ComponentTypeSwitch = () => {
  const [{ type }] = LandingCustomSectionComponentSlice.useContext();

  return type === "article" ? (
    <Article />
  ) : type === "blog" ? (
    <Blog />
  ) : (
    <RecordedEvent />
  );
};

export const ComponentMenu = ({
  isShowing,
  children: extraButtons,
}: {
  isShowing: boolean;
  children?: ReactElement;
}) => {
  const [{ width }, { deleteComponentFromCustom, updateComponentWidth }] =
    LandingCustomSectionComponentSlice.useContext();

  const canNarrow = width > 1;
  const canWiden = width < 3;

  return (
    <ContentMenu styles={tw`absolute left-0 bottom-10`} show={isShowing}>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove component", type: "action" }}
        warningProps={{
          callbackToConfirm: deleteComponentFromCustom,
          warningText: "Remove component?",
        }}
      >
        <Trash />
      </ContentMenu.ButtonWithWarning>
      <ContentMenu.VerticalBar />
      <ContentMenu.Button
        isDisabled={!canWiden}
        onClick={() => updateComponentWidth({ width: width + 1 })}
        tooltipProps={{ text: "widen" }}
      >
        <ArrowsOutLineHorizontal />
      </ContentMenu.Button>
      <ContentMenu.Button
        isDisabled={!canNarrow}
        onClick={() => updateComponentWidth({ width: width - 1 })}
        tooltipProps={{ text: "narrow" }}
      >
        <ArrowsInLineHorizontal />
      </ContentMenu.Button>
      {extraButtons ? extraButtons : null}
    </ContentMenu>
  );
};
