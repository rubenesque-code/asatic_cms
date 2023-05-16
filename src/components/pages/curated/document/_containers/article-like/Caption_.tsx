import TextArea from "^components/editors/TextArea";

import { $Caption } from "^document-pages/_styles/$articleLikeDocument";

export const Caption_ = ({
  caption,
  updateCaption,
}: {
  caption: string | undefined;
  updateCaption: (caption: string) => void;
}) => {
  return (
    <$Caption>
      <TextArea
        injectedValue={caption}
        onBlur={updateCaption}
        placeholder="optional caption"
      />
    </$Caption>
  );
};
