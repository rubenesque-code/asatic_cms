import { useSelector } from "^redux/hooks";
import { selectArticlesByIds } from "^redux/state/articles";
import { selectBlogsByIds } from "^redux/state/blogs";
import { selectRecordedEventsByIds } from "^redux/state/recordedEvents";
import { selectCollectionsByIds } from "^redux/state/collections";

import SubjectSlice from "^context/subjects/SubjectContext";

import { orderDisplayContent } from "^helpers/displayContent";

import { $EntitiesContainer } from "./_styles";

import Entity from "./primary-entity";
import { $MissingEntities_ } from "../_presentation/$MissingEntities_";
import Collections from "./collections";

// * not giving the ability to remove entities not found in store since it shouldn't happen since making entities related on the frontend.

const Populated = () => {
  const [{ articlesIds, blogsIds, collectionsIds, recordedEventsIds }] =
    SubjectSlice.useContext();

  const { articles, blogs, collections, recordedEvents } = useSelector(
    (state) => ({
      articles: {
        all: selectArticlesByIds(state, articlesIds),
        get found() {
          return this.all.flatMap((e) => (e ? [e] : []));
        },
        get numMissing() {
          return this.all.filter((e) => e === undefined).length;
        },
      },
      blogs: {
        all: selectBlogsByIds(state, blogsIds),
        get found() {
          return this.all.flatMap((e) => (e ? [e] : []));
        },
        get numMissing() {
          return this.all.filter((e) => e === undefined).length;
        },
      },
      collections: {
        all: selectCollectionsByIds(state, collectionsIds),
        get found() {
          return this.all.flatMap((e) => (e ? [e] : []));
        },
        get numMissing() {
          return this.all.filter((e) => e === undefined).length;
        },
      },
      recordedEvents: {
        all: selectRecordedEventsByIds(state, recordedEventsIds),
        get found() {
          return this.all.flatMap((e) => (e ? [e] : []));
        },
        get numMissing() {
          return this.all.filter((e) => e === undefined).length;
        },
      },
    })
  );

  const primaryEntitiesOrdered = orderDisplayContent([
    ...articles.found,
    ...blogs.found,
    ...recordedEvents.found,
  ]);

  const firstSectionPrimaryEntities = primaryEntitiesOrdered.slice(0, 6);

  return (
    <>
      <$MissingEntities_
        articles={articles.numMissing}
        blogs={blogs.numMissing}
        collections={collections.numMissing}
        recordedEvents={recordedEvents.numMissing}
      />
      <$EntitiesContainer>
        {[
          collections.found.length
            ? firstSectionPrimaryEntities
            : primaryEntitiesOrdered,
        ]
          .flatMap((e) => e)
          .map((e) => (
            <Entity entity={{ id: e.id, name: e.type }} key={e.id} />
          ))}
      </$EntitiesContainer>
      {collections.found.length ? (
        <Collections collections={collections.found} />
      ) : null}
    </>
  );
};

export default Populated;
