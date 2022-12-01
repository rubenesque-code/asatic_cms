import tw from "twin.macro";

import { useComponentContext } from "../Context";

import { $PanelContainer, $Heading } from "^components/rich-popover/_styles";
import { DeleteEntityIcon } from "^components/Icons";
import WithWarning from "^components/WithWarning";
import { entityNameToLabel } from "^constants/data";

const Panel = () => {
  const { deleteEntity, entityType } = useComponentContext();

  return (
    <$PanelContainer css={[tw`w-[40ch]`]}>
      <$Heading>Further settings</$Heading>
      <div css={[tw`mt-md`]}>
        <WithWarning
          callbackToConfirm={deleteEntity}
          warningText={{
            heading: `Delete ${entityType}`,
            body: `Are you sure you want to delete this ${entityType}? This can't be undone.`,
          }}
        >
          <button
            className="group"
            css={[
              tw`text-gray-600 hover:text-gray-800`,
              tw`w-full text-left px-sm py-xs flex gap-sm items-center transition-colors ease-in-out duration-75`,
            ]}
            type="button"
          >
            <span css={[tw`group-hover:text-red-warning`]}>
              <DeleteEntityIcon />
            </span>
            <span>Delete this {entityNameToLabel(entityType)}</span>
          </button>
        </WithWarning>
      </div>
    </$PanelContainer>
  );
};

export default Panel;
