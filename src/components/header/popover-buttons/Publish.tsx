import { PublishPopoverButton } from "^components/rich-popover/publish";
import { $ButtonText } from "../_styles";

const HeaderPublishButton = () => {
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

export default HeaderPublishButton;
