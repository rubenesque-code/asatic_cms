import {
  ArticleIcon,
  BlogIcon,
  CollectionIcon,
  RecordedEventIcon,
  SubjectIcon,
} from "^components/Icons";
import { EntityNameSubSet } from "^types/entity";

type DocumentEntityName = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;
export const DocumentEntityNameToIcon = ({
  entityName,
}: {
  entityName: DocumentEntityName;
}) =>
  entityName === "article" ? (
    <ArticleIcon />
  ) : entityName === "blog" ? (
    <BlogIcon />
  ) : entityName === "collection" ? (
    <CollectionIcon />
  ) : entityName === "recordedEvent" ? (
    <RecordedEventIcon />
  ) : (
    <SubjectIcon />
  );
