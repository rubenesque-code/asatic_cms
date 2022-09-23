import tw from "twin.macro";
import {
  ArrowsInLineHorizontal,
  ArrowsOutLineHorizontal,
  Plus,
  Trash,
} from "phosphor-react";

import LandingSectionSlice from "^context/landing/LandingSectionContext";
import LandingCustomSectionSlice from "^context/landing/LandingCustomSectionContext";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

import { sortComponents, mapIds } from "^helpers/general";

import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";

import { LandingSectionCustom } from "^types/landing";

import AddContentPopover from "./AddContentPopover";
import CustomSectionUI from "./CustomSectionUI";
import Article from "./Article";
import Blog from "./Blog";
import RecordedEvent from "./RecordedEvent";
import ContentMenu from "^components/menus/Content";
import ContainerUtility from "^components/ContainerUtilities";
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
    <div>
      <p>No content yet for this custom component</p>
      <AddContentPopover>
        <AddContentPopover.Button>
          <button type="button">Add content</button>
        </AddContentPopover.Button>
      </AddContentPopover>
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
    <ContainerUtility.isHovered
      styles={tw`relative min-h-[400px] border w-full`}
    >
      {(containerIsHovered) => (
        <>
          <ComponentMenu isShowing={containerIsHovered} />
          <ComponentTypeSwitch />
        </>
      )}
    </ContainerUtility.isHovered>
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

const ComponentMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ width }, { deleteComponentFromCustom, updateComponentWidth }] =
    LandingCustomSectionComponentSlice.useContext();

  const canNarrow = width > 1;
  const canWiden = width < 3;

  return (
    <ContentMenu styles={tw`absolute left-0 top-8`} show={isShowing}>
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
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: "remove component", type: "action" }}
        warningProps={{
          callbackToConfirm: deleteComponentFromCustom,
          warningText: "Remove component?",
        }}
      >
        <Trash />
      </ContentMenu.ButtonWithWarning>
    </ContentMenu>
  );
};
