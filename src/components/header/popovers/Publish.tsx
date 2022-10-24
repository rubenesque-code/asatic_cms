import { MyOmit } from "^types/utilities";

import {
  PublishPopoverButton,
  PublishPopover_,
  PublishPopover_Props,
} from "^components/rich-popover/publish";
import { $ButtonText } from "../_styles";

export const HeaderPublishPopover_ = (
  props: MyOmit<PublishPopover_Props, "children">
) => {
  return (
    <PublishPopover_ {...props}>
      <Button />
    </PublishPopover_>
  );
};

const Button = () => {
  return (
    <PublishPopoverButton>
      {(publishStatus) => (
        <button type="button">
          <$ButtonText>{publishStatus}</$ButtonText>
        </button>
      )}
    </PublishPopoverButton>
  );
};
