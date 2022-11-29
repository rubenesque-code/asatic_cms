import { useState } from "react";
import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";
import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";
import { EntityNameSubSet } from "^types/entity";

const RelatedDocument = ({
  entity,
  translations,
}: {
  entity: {
    name: EntityNameSubSet<
      "article" | "blog" | "collection" | "recordedEvent" | "subject"
    >;
    id: string;
  };
  translations: {
    title: string;
    languageId: string;
  }[];
}) => {
  const [translation, setTranslation] = useState(
    translations.find(
      (t) =>
        t.languageId === default_language_Id ||
        t.languageId === second_default_language_Id
    ) || translations[0]
  );

  const language = useSelector((state) =>
    selectLanguageById(state, translation.languageId)
  );

  return (
    <div>
      <div>{translation.title}</div>
      <div>
        // todo: map translation languages
        {!language ? (
          <div></div>
        ) : (
          <div>
            <div css={[tw``]}>{language.name}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedDocument;
