import tw from "twin.macro";

import { mapIds } from "^helpers/general";

import { reorderCustomSection, selectAll } from "^redux/state/landing";

import { LandingCustomSectionComponent } from "^types/landing";

import Menu from "./Menu";
import ContainerUtility from "^components/ContainerUtilities";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import { useDispatch, useSelector } from "^redux/hooks";
import CustomSectionComponent from "./component";
import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";

export const FirstCustomSection = () => {
  const customSectionComponents = useSelector(selectAll);
  const firstSectionComponents = customSectionComponents
    .filter((component) => component.section === 0)
    .sort((a, b) => a.index - b.index);

  return (
    <div css={[tw`flex items-stretch min-h-[800px]`]}>
      {!firstSectionComponents.length ? (
        <div>First section: empty. Add articles or blogs.</div>
      ) : (
        <SectionPopulated section={0} components={firstSectionComponents} />
      )}
    </div>
  );
};

export const SecondCustomSection = () => {
  const customSectionComponents = useSelector(selectAll);
  const secondSectionComponents = customSectionComponents
    .filter((component) => component.section === 1)
    .sort((a, b) => a.index - b.index);

  return (
    <div css={[tw`flex items-stretch min-h-[600px]`]}>
      {!secondSectionComponents.length ? (
        <div>Second section: empty. Add articles or blogs.</div>
      ) : (
        <SectionPopulated section={1} components={secondSectionComponents} />
      )}
    </div>
  );
};

const SectionPopulated = ({
  section,
  components,
}: {
  section: LandingCustomSectionComponent["section"];
  components: LandingCustomSectionComponent[];
}) => {
  const dispatch = useDispatch();

  return (
    <div css={[tw`flex justify-center w-full`]}>
      <ContainerUtility.isHovered
        styles={tw`relative border w-full max-w-[1300px]`}
      >
        {(isHovered) => (
          <div css={[tw`w-full`]}>
            <ContainerUtility.Width>
              {(containerWidth) => (
                <div css={[tw`w-full grid grid-cols-4`]}>
                  {containerWidth ? (
                    <DndSortableContext
                      elementIds={mapIds(components)}
                      onReorder={({ activeId, overId }) => {
                        dispatch(
                          reorderCustomSection({ activeId, overId, section })
                        );
                      }}
                    >
                      {components.map((component) => (
                        <DndSortableElement
                          colSpan={
                            containerWidth < 750
                              ? 4
                              : containerWidth < 900
                              ? 2
                              : component.width
                          }
                          elementId={component.id}
                          key={component.id}
                        >
                          <LandingCustomSectionComponentSlice.Provider
                            changeSpanIsDisabled={containerWidth < 900}
                            component={component}
                          >
                            <CustomSectionComponent />
                          </LandingCustomSectionComponentSlice.Provider>
                        </DndSortableElement>
                      ))}
                    </DndSortableContext>
                  ) : null}
                </div>
              )}
            </ContainerUtility.Width>
            <Menu isShowing={isHovered} section={section} />
          </div>
        )}
      </ContainerUtility.isHovered>
    </div>
  );
};
