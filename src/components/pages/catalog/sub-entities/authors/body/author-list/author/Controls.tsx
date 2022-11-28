import { DotsThreeVertical } from "phosphor-react";
import tw from "twin.macro";
import { DeleteEntityIcon } from "^components/Icons";
import Popover from "^components/ProximityPopover";
import WithWarning from "^components/WithWarning";
import { EntityNameSubSet } from "^types/entity";

type Props = {
  deleteEntity: () => void;
  entityName: EntityNameSubSet<"author" | "recordedEventType" | "tag">;
};

const Controls = (props: Props) => {
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

export default Controls;

const Panel = ({ deleteEntity, entityName }: Props) => {
  return (
    <div css={[tw`bg-white shadow-md py-sm px-md rounded-md`]}>
      <WithWarning
        callbackToConfirm={deleteEntity}
        warningText={{
          heading: `Delete ${entityName}?`,
          body: "This can't be undone.",
        }}
      >
        <button
          css={[
            tw`text-gray-400 hover:text-red-warning transition-colors ease-in-out`,
          ]}
          type="button"
        >
          <DeleteEntityIcon />
        </button>
      </WithWarning>
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
