import { useComponentContext } from "../../../Context";

import {
  $MissingEntity,
  $Entity,
} from "^components/rich-popover/_presentation";
import Found from "./Found";
import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";

const Language = ({ id: languageId }: { id: string }) => {
  const { parentEntity } = useComponentContext();

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return (
    <$Entity
      entity={{
        element: language ? (
          <Found language={language} />
        ) : (
          <$MissingEntity entityType="language" />
        ),
        name: "language",
      }}
      parentEntity={{
        name: parentEntity.name,
        removeFrom: () => parentEntity.removeTranslation(languageId),
      }}
    />
  );
};

export default Language;
