import WithUploadImage from "^components/WithUploadImage";
import { $CreateEntityButton_ } from "../../../_presentation";

const UploadButton = () => {
  return (
    <WithUploadImage>
      <$CreateEntityButton_ text="Upload new image" />
    </WithUploadImage>
  );
};

export default UploadButton;
