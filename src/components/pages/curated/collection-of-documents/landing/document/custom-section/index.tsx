import tw from "twin.macro";

import { mapIds } from "^helpers/general";

import {
  reorderCustomSection,
  removeOne as removeCustomSectionComponent,
  updateComponentWidth,
} from "^redux/state/landing";

import { LandingCustomSectionComponent } from "^types/landing";

import Menu from "./Menu";
import ContainerUtility from "^components/ContainerUtilities";
import DndSortableContext from "^components/dndkit/DndSortableContext";
import DndSortableElement from "^components/dndkit/DndSortableElement";
import { useDispatch } from "^redux/hooks";
import CustomSectionComponent from "./component";
import { CustomSectionComponentProvider } from "^context/CustomSectionComponentContext";
import { ReactElement } from "react";
import Empty from "./Empty";

export const FirstCustomSection = ({
  components,
}: {
  components: LandingCustomSectionComponent[];
}) => {
  return (
    <SectionContainer section={0}>
      {!components.length ? (
        <Empty section={0} />
      ) : (
        <SectionPopulated section={0} components={components} />
      )}
    </SectionContainer>
  );
};

export const SecondCustomSection = ({
  components,
}: {
  components: LandingCustomSectionComponent[];
}) => {
  return (
    <SectionContainer section={1}>
      {!components.length ? (
        <Empty section={1} />
      ) : (
        <SectionPopulated section={0} components={components} />
      )}
    </SectionContainer>
  );
};

const SectionContainer = ({
  section,
  children,
}: {
  section: LandingCustomSectionComponent["section"];
  children: ReactElement;
}) => {
  return (
    <div css={[tw`flex justify-center w-full`]}>
      <ContainerUtility.isHovered
        styles={tw`relative border w-full max-w-[1300px]`}
      >
        {(isHovered) => (
          <div css={[tw`w-full`]}>
            {children}
            <Menu isShowing={isHovered} section={section} />
          </div>
        )}
      </ContainerUtility.isHovered>
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
    <ContainerUtility.Width>
      {(containerWidth) => (
        <div css={[tw`w-full grid grid-cols-4`]}>
          {containerWidth ? (
            <DndSortableContext
              elementIds={mapIds(components)}
              onReorder={({ activeId, overId }) => {
                dispatch(reorderCustomSection({ activeId, overId, section }));
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
                  <CustomSectionComponentProvider
                    colSpan={
                      containerWidth < 900
                        ? "1/2"
                        : component.width === 2
                        ? "1/2"
                        : "1/4"
                    }
                    rowSpan={1}
                    imageOverride={
                      component.width === 1 && containerWidth >= 900
                        ? "always-hide"
                        : undefined
                    }
                    removeFromParent={{
                      parent: { name: "landing" },
                      func: () =>
                        dispatch(
                          removeCustomSectionComponent({
                            id: component.id,
                          })
                        ),
                    }}
                    changeColSpan={(width: 1 | 2) =>
                      dispatch(
                        updateComponentWidth({
                          id: component.id,
                          width,
                        })
                      )
                    }
                  >
                    <CustomSectionComponent entity={component.entity} />
                  </CustomSectionComponentProvider>
                </DndSortableElement>
              ))}
            </DndSortableContext>
          ) : null}
        </div>
      )}
    </ContainerUtility.Width>
  );
};
