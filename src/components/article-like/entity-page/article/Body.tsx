import React, { ReactElement, useState } from "react";

import ArticleUI from "^components/article-like/entity-page/article/UI";

export default function ArticleBody({
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
    <ArticleUI.Body>
      <>
        {addSectionMenu({
          isShowing: sectionHoveredIndex === 0,
          sectionToAddIndex: 0,
        })}
        {articleBodySections.map((section, i) => (
          <ArticleUI.BodySection key={section.key}>
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
          </ArticleUI.BodySection>
        ))}
      </>
    </ArticleUI.Body>
  );
}
