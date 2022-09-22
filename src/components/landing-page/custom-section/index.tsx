import {
  LandingCustomSectionProvider,
  useLandingCustomSectionContext,
} from "^context/landing/LandingCustomSectionContext";
import LandingSectionSlice from "^context/landing/LandingSectionContext";

import { sortComponents, mapIds } from "^helpers/general";

import DndSortableContext from "^components/dndkit/DndSortableContext";

import { LandingSectionCustom } from "^types/landing";
import AddContentPopover from "./AddContentPopover";
import CustomSectionUI from "./CustomSectionUI";
import DndSortableElement from "^components/dndkit/DndSortableElement";

const CustomSection = () => {
  const [section] = LandingSectionSlice.useContext();
  const sectionAsserted = section as LandingSectionCustom;
  const { components } = sectionAsserted;

  return (
    <LandingCustomSectionProvider section={sectionAsserted}>
      {components.length ? <Content /> : <NoContent />}
    </LandingCustomSectionProvider>
  );
};

export default CustomSection;

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
  const [{ components }, { reorderCustomSection }] =
    useLandingCustomSectionContext();

  const componentsOrdered = sortComponents(components);

  return (
    <CustomSectionUI>
      <DndSortableContext
        elementIds={mapIds(componentsOrdered)}
        onReorder={reorderCustomSection}
      >
        {componentsOrdered.map((component) => (
          <DndSortableElement elementId={component.id} key={component.id}>
            <Component component={component} />
          </DndSortableElement>
        ))}
      </DndSortableContext>
    </CustomSectionUI>
  );
};

const Component = ({
  component,
}: {
  component: LandingSectionCustom["components"][number];
}) => {
  return (
    <div>
      {component.type}
      {component.id}
    </div>
  );
};
