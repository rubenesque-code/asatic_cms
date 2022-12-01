import Link from "next/link";
import { DotsThreeVertical } from "phosphor-react";
import tw from "twin.macro";

import { GoToPageIcon, RemoveRelatedEntityIcon } from "^components/Icons";
import Popover from "^components/ProximityPopover";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";

export type Props = {
  relatedEntity: {
    // name: EntityNameSubSet<'author'>
    remove: () => void;
    href?: string;
  };
};

export const $RelatedEntityMenu_ = (props: Props) => {
  return (
    <Popover>
      <>
        <Popover.Panel>
          <Panel {...props} />
        </Popover.Panel>
        <Popover.Button>
          <Button />
        </Popover.Button>
      </>
    </Popover>
  );
};

const Panel = ({ relatedEntity }: Props) => {
  return (
    <div
      css={[
        tw`bg-white shadow-md py-sm px-md rounded-md flex items-center gap-md`,
      ]}
    >
      <WithWarning
        callbackToConfirm={relatedEntity.remove}
        warningText="Remove from document?"
      >
        <WithTooltip text="Remove from document">
          <button
            css={[
              tw`text-gray-400 hover:text-red-warning transition-colors ease-in-out`,
            ]}
            type="button"
          >
            <RemoveRelatedEntityIcon />
          </button>
        </WithTooltip>
      </WithWarning>
      {!relatedEntity.href ? null : (
        <Link href={relatedEntity.href} passHref>
          <div
            css={tw`text-gray-400 hover:text-gray-600 cursor-pointer transition-colors ease-in-out`}
          >
            <WithTooltip text="go to page">
              <GoToPageIcon />
            </WithTooltip>
          </div>
        </Link>
      )}
    </div>
  );
};

const Button = () => {
  return (
    <button
      css={[
        tw`text-2xl text-gray-200 group-hover:text-gray-500`,
        tw`transition-colors ease-in-out`,
      ]}
      type="button"
    >
      <DotsThreeVertical />
    </button>
  );
};
