import { Fragment, useState } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectIds } from "^redux/state/landing";

import ContainerUtility from "^components/ContainerUtilities";

import AddSectionMenu from "./AddSectionMenu";
import Section from "./section";

const Populated = () => {
  const [sectionHoveredIndex, setSectionHoveredIndex] = useState<number | null>(
    null
  );

  const sectionIds = useSelector(selectIds) as string[];

  return (
    <div css={[tw`mt-lg`]}>
      <AddSectionMenu
        newSectionIndex={0}
        adjacentSectionIsHovered={sectionHoveredIndex === 0}
      />
      {sectionIds.map((sectionId, i) => (
        <Fragment key={sectionId}>
          <ContainerUtility.onHover
            onMouseEnter={() => setSectionHoveredIndex(i)}
            onMouseLeave={() => setSectionHoveredIndex(null)}
          >
            <Section id={sectionId} />
          </ContainerUtility.onHover>
          <AddSectionMenu
            adjacentSectionIsHovered={
              sectionHoveredIndex === i || sectionHoveredIndex === i + 1
            }
            newSectionIndex={i + 1}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default Populated;
