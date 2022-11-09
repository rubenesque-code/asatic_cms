import { Article } from "^types/article";
import { Collection } from "^types/collection";
import { RecordedEvent } from "^types/recordedEvent";
import { Subject } from "^types/subject";
import { Blog } from "^types/blog";
import { Tag } from "^types/tag";
import { EntityWarning } from "^types/entity-status";
import { EntityName } from "^types/entity";
import { TranslationField } from "^types/entity-translation";
import { Author } from "^types/author";

export function handleRelatedEntityWarnings<
  TEntity extends
    | Article
    | Author
    | Blog
    | Collection
    | RecordedEvent
    | Subject
    | Tag,
  TRelatedEntity extends EntityName
>({
  relatedEntity,
  entityWarnings,
}: {
  relatedEntity: {
    type: TRelatedEntity;
    entities: (TEntity | undefined)[];
    checkValidity: (entity: TEntity) => boolean;
  };
  entityWarnings: EntityWarning<TRelatedEntity>;
}) {
  for (let i = 0; i < relatedEntity.entities.length; i++) {
    const entity = relatedEntity.entities[i];
    if (!entity) {
      entityWarnings.relatedEntitiesMissing.push(relatedEntity.type);
      break;
    }
    if (!relatedEntity.checkValidity) {
      entityWarnings.relatedEntitiesInvalid.push(relatedEntity.type);
    }
  }
}

export function handleOwnTranslationWarnings<
  TTranslation extends TranslationField<"languageId">
>({
  checkValidity,
  onInvalid,
  translations,
}: {
  translations: TTranslation[];
  checkValidity: (translation: TTranslation) => boolean;
  onInvalid: (translation: TTranslation) => void;
}) {
  for (let i = 0; i < translations.length; i++) {
    const translation = translations[i];
    if (!checkValidity(translation)) {
      onInvalid(translation);
    }
  }
}
