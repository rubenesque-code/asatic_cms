import { WarningCircle } from "phosphor-react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import Menu from "./Menu_";

const MissingEntity_ = ({ entityType }: { entityType: string }) => {
  return (
    <ContainerUtility.isHovered
      styles={tw`relative p-md border-2 border-red-warning h-full grid place-items-center`}
    >
      {(isHovered) => (
        <>
          <div css={[tw`text-center`]}>
            <h4 css={[tw`font-medium flex items-center justify-center gap-xs`]}>
              <span css={[tw`text-red-warning`]}>
                <WarningCircle weight="bold" />
              </span>
              Missing {entityType}
            </h4>
            <p css={[tw`mt-sm text-sm text-gray-700`]}>
              This component references an {entityType} that couldn&apos;t be
              found. <br /> It&apos;s probably been deleted by a user, but you
              can try refreshing the page.
            </p>
          </div>
          <Menu isShowing={isHovered} />
        </>
      )}
    </ContainerUtility.isHovered>
  );
};

export default MissingEntity_;
