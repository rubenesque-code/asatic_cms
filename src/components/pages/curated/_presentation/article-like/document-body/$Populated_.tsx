import React, { Fragment, ReactElement, useState } from "react";

import { $DocumentBodyAddSectionMenu_ } from "./$AddSectionMenu_";
import { $BodyPopulatedContainer } from "../../../_styles/$ArticleLike";
import tw from "twin.macro";

export function $DocumentBodyPopulated_({
  children: articleBodySections,
  addSectionPopover,
}: {
  children: ReactElement[];
  addSectionPopover: (
    button: ReactElement,
    sectionToAddIndex: number
  ) => ReactElement;
}) {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<number | null>(
    null
  );

  return (
    <$BodyPopulatedContainer>
      <>
        <$DocumentBodyAddSectionMenu_ isShowing={sectionHoveredIndex === 0}>
          {(button) => addSectionPopover(button, 0)}
        </$DocumentBodyAddSectionMenu_>
        {articleBodySections.map((section, i) => (
          <Fragment key={section.key}>
            <>
              <div
                onMouseEnter={() => setSectionHoveredIndex(i)}
                onMouseLeave={() => setSectionHoveredIndex(null)}
              >
                {section}
              </div>
              <$DocumentBodyAddSectionMenu_
                isShowing={
                  sectionHoveredIndex === i || sectionHoveredIndex === i + 1
                }
              >
                {(button) => addSectionPopover(button, i + 1)}
              </$DocumentBodyAddSectionMenu_>
            </>
          </Fragment>
        ))}
      </>
      <div css={[tw`h-[100px]`]} />
    </$BodyPopulatedContainer>
  );
}
