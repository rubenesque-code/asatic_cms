import React, { cloneElement, Fragment, ReactElement, useState } from "react";
import { PlusCircle } from "phosphor-react";

import { BodyContainer } from "^components/article-like/entity-page/article/styles/article";
import {
  ButtonsContainer,
  Container as AddSectionMenuContainer,
} from "^components/article-like/entity-page/article/styles/addSectionMenu";
import ContentMenu from "^components/menus/Content";

export default function Body({
  addSectionMenu,
  children: articleBodySections,
}: {
  addSectionMenu: ({
    isShowing,
    sectionToAddIndex,
  }: {
    isShowing: boolean;
    sectionToAddIndex: number;
  }) => ReactElement;
  children: ReactElement[];
}) {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<number | null>(
    null
  );

  return (
    <BodyContainer>
      <>
        {addSectionMenu({
          isShowing: sectionHoveredIndex === 0,
          sectionToAddIndex: 0,
        })}
        {articleBodySections.map((section, i) => (
          <Fragment key={section.key}>
            <>
              <div
                onMouseEnter={() => setSectionHoveredIndex(i)}
                onMouseLeave={() => setSectionHoveredIndex(null)}
              >
                {section}
              </div>
              {addSectionMenu({
                isShowing:
                  sectionHoveredIndex === i || sectionHoveredIndex === i + 1,
                sectionToAddIndex: i + 1,
              })}
            </>
          </Fragment>
        ))}
      </>
    </BodyContainer>
  );
}

function AddSectionMenu({
  addSectionPopover: addSectionPopover,
  isShowing,
}: {
  addSectionPopover: ReactElement;
  isShowing: boolean;
}) {
  return (
    <AddSectionMenuContainer isShowing={isShowing}>
      <ButtonsContainer>
        {cloneElement(
          addSectionPopover,
          {
            ...addSectionPopover.props,
          },
          <AddSectionButton />
        )}
      </ButtonsContainer>
    </AddSectionMenuContainer>
  );
}

Body.AddSectionMenu = AddSectionMenu;

function AddSectionButton() {
  return (
    <ContentMenu.Button
      tooltipProps={{ text: "add a text, image or video section" }}
    >
      <PlusCircle />
    </ContentMenu.Button>
  );
}
