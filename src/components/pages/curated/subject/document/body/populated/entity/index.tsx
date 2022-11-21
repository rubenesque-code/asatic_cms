import SubjectSlice from "^context/subjects/SubjectContext";
import { useSelector } from "^redux/hooks";
import { selectArticleById } from "^redux/state/articles";
import { selectBlogById } from "^redux/state/blogs";
import { selectCollectionById } from "^redux/state/collections";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import { SubjectDisplayEntity } from "^types/subject";

import { EntityMenu_ } from "./_container";
import { $MissingDisplayEntity_, $EntityContainer_ } from "./_presentation";

import Article from "./article";
import Blog from "./blog";
import RecordedEvent from "./recorded-event";

const Entity = ({
  entity,
}: {
  entity: {
    name: SubjectDisplayEntity;
    id: string;
  };
}) => {
  const storeEntity = useSelector((state) =>
    entity.name === "article"
      ? selectArticleById(state, entity.id)
      : entity.name === "blog"
      ? selectBlogById(state, entity.id)
      : entity.name === "collection"
      ? selectCollectionById(state, entity.id)
      : selectRecordedEventById(state, entity.id)
  );

  return (
    <$EntityContainer_>
      {(containerIsHovered) =>
        !storeEntity ? (
          <MissingEntity
            containerIsHovered={containerIsHovered}
            entity={entity}
          />
        ) : storeEntity.type === "article" ? (
          <Article
            article={storeEntity}
            containerIsHovered={containerIsHovered}
          />
        ) : storeEntity.type === "blog" ? (
          <Blog blog={storeEntity} containerIsHovered={containerIsHovered} />
        ) : storeEntity.type === "recordedEvent" ? (
          <RecordedEvent
            containerIsHovered={containerIsHovered}
            recordedEvent={storeEntity}
          />
        ) : (
          <div>Hello</div>
        )
      }
    </$EntityContainer_>
  );
};

export default Entity;

const MissingEntity = ({
  entity,
  containerIsHovered,
}: {
  entity: { id: string; name: SubjectDisplayEntity };
  containerIsHovered: boolean;
}) => (
  <>
    <$MissingDisplayEntity_ entityName={entity.name} />
    <MissingEntityMenu entity={entity} isShowing={containerIsHovered} />
  </>
);

const MissingEntityMenu = ({
  entity,
  isShowing,
}: {
  entity: { id: string; name: SubjectDisplayEntity };
  isShowing: boolean;
}) => {
  const [, { removeRelatedEntity }] = SubjectSlice.useContext();

  return (
    <EntityMenu_
      isShowing={isShowing}
      removeEntity={() => removeRelatedEntity({ relatedEntity: entity })}
    />
  );
};

/* const EntityTypeSwitch = ({
  entity,
}: {
  entity: ArticleType | BlogType | RecordedEventType;
}) => {
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return entity.type === "article" ? (
    <ArticleSlice.Provider article={entity}>
      {([{ translations }]) => (
        <ArticleTranslationSlice.Provider
          articleId={entity.id}
          translation={selectTranslationForActiveLanguage(
            translations,
            activeLanguageId
          )}
        >
          <Article />
        </ArticleTranslationSlice.Provider>
      )}
    </ArticleSlice.Provider>
  ) : entity.type === "blog" ? (
    <BlogSlice.Provider blog={entity}>
      {([{ translations }]) => (
        <BlogTranslationSlice.Provider
          blogId={entity.id}
          translation={selectTranslationForActiveLanguage(
            translations,
            activeLanguageId
          )}
        >
          <Blog />
        </BlogTranslationSlice.Provider>
      )}
    </BlogSlice.Provider>
  ) : (
    <RecordedEventSlice.Provider recordedEvent={entity}>
      {([{ translations }]) => (
        <RecordedEventTranslationSlice.Provider
          recordedEventId={entity.id}
          translation={selectTranslationForActiveLanguage(
            translations,
            activeLanguageId
          )}
        >
          <RecordedEvent />
        </RecordedEventTranslationSlice.Provider>
      )}
    </RecordedEventSlice.Provider>
  );
}; */
