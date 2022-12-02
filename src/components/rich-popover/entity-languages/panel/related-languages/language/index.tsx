import { useComponentContext } from "../../../Context";

import {
  $MissingEntity,
  $RelatedEntity_,
  $RelatedEntityMenu_,
} from "^components/rich-popover/_presentation";
import Found from "./Found";
import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";
import { Language as LanguageType } from "^types/language";

const RelatedEntity = ({ id: languageId }: { id: string }) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return (
    <$RelatedEntity_
      entity={<Language language={language} />}
      menu={<Menu id={languageId} />}
    />
  );
};

export default RelatedEntity;

const Language = ({ language }: { language: LanguageType | undefined }) => {
  return language ? (
    <Found language={language} />
  ) : (
    <$MissingEntity entityType="language" />
  );
};

const Menu = ({ id: languageId }: { id: string }) => {
  const { parentEntity } = useComponentContext();

  if (parentEntity.languagesIds.length < 2) {
    return null;
  }

  return (
    <$RelatedEntityMenu_
      relatedEntity={{
        remove: () => parentEntity.removeTranslation(languageId),
      }}
    />
  );
};
