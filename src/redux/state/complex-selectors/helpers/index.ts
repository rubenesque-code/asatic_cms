import { RootState } from "^redux/store";
import { selectAuthorsByIds } from "^redux/state/authors";
import { selectCollectionsByIds } from "^redux/state/collections";
import { selectSubjectsByIds } from "^redux/state/subjects";
import { selectTagsByIds } from "^redux/state/tags";

import { fuzzySearch, mapLanguageIds } from "^helpers/general";

import { allLanguageId } from "^components/LanguageSelect";

import { TranslationGeneric } from "^types/translation";
import { PrimaryEntity } from "^types/primary-entity";

export function filterEntitiesByLanguage<
  TTranslation extends TranslationGeneric,
  TEntity extends { translations: TTranslation[] }
>(entities: TEntity[], languageId: string) {
  return languageId === allLanguageId
    ? entities
    : entities.filter((entity) =>
        mapLanguageIds(entity.translations).includes(languageId)
      );
}

export function filterPrimaryEntitiesByQuery<
  TTranslation extends { languageId: string; title?: string },
  TEntity extends PrimaryEntity & { id: string; translations: TTranslation[] }
>(state: RootState, entities: TEntity[], query: string) {
  if (!query.length) {
    return entities;
  }

  const queryableEntities = entities.map((entity) => {
    const {
      id,
      authorsIds,
      collectionsIds,
      subjectsIds,
      tagsIds,
      translations,
    } = entity;

    const authors = selectAuthorsByIds(state, authorsIds).flatMap((a) =>
      a ? [a] : []
    );
    const authorsText = authors
      .flatMap((a) => a.translations)
      .flatMap((t) => t.name);

    const collections = selectCollectionsByIds(state, collectionsIds).flatMap(
      (c) => (c ? [c] : [])
    );
    const collectionsText = collections
      .flatMap((c) => c.translations)
      .flatMap((t) => t.title);

    const subjects = selectSubjectsByIds(state, subjectsIds).flatMap((s) =>
      s ? [s] : []
    );
    const subjectsText = subjects
      .flatMap((s) => s.translations)
      .flatMap((t) => t.text);

    const tags = selectTagsByIds(state, tagsIds).flatMap((t) => (t ? [t] : []));
    const tagsText = tags.flatMap((t) => t.text);

    const entityText = translations.map((t) => t.title);

    return {
      id,
      entityText,
      authorsText,
      collectionsText,
      subjectsText,
      tagsText,
    };
  });

  const entitiesMatchingQuery = fuzzySearch(
    [
      "entityText",
      "authorsText",
      "collectionsText",
      "subjectsText",
      "tagsText",
    ],
    queryableEntities,
    query
  ).map((r) => {
    const entityId = r.item.id;
    const entity = entities.find((entity) => entity.id === entityId)!;

    return entity;
  });

  return entitiesMatchingQuery;
}

export function handleTranslatableRelatedEntityErrors<
  TTranslation extends TranslationGeneric,
  TEntity extends { translations: TTranslation[] } | undefined
>({
  relatedEntities,
  entityLanguagesIds,
  onMissingEntity,
  onMissingEntityTranslation,
}: {
  relatedEntities: TEntity[];
  entityLanguagesIds: string[];
  onMissingEntity: () => void;
  onMissingEntityTranslation: () => void;
}) {
  for (let i = 0; i < relatedEntities.length; i++) {
    const relatedEntity = relatedEntities[i];
    if (!relatedEntity) {
      onMissingEntity();
    } else {
      const relatedEntityLanguagesIds = mapLanguageIds(
        relatedEntity.translations
      );
      for (let j = 0; j < entityLanguagesIds.length; j++) {
        const languageId = entityLanguagesIds[j];
        if (!relatedEntityLanguagesIds.includes(languageId)) {
          onMissingEntityTranslation();
        }
      }
    }
  }
}
