import {
  Article as ArticleIcon,
  Notepad as NotepadIcon,
  VideoCamera as VideoCameraIcon,
} from "phosphor-react";

import { useSelector } from "^redux/hooks";
import { selectAll as selectArticles } from "^redux/state/articles";
import { selectAll as selectBlogs } from "^redux/state/blogs";
import { selectAll as selectRecordedEvents } from "^redux/state/recordedEvents";

import { filterPrimaryContentByRelationToSubContentDoc } from "^helpers/general";

import { SubContentFields, SubContentType } from "^types/primary-content";

import { ContentMenuButton } from "^components/menus/Content";
import WithRelatedContent from "^components/WithRelatedContent";
import { MyOmit } from "^types/utilities";

type SubContentProps = {
  subContentType: SubContentType;
  subContentField: keyof SubContentFields;
  subContentId: string;
};

const RelatedContentPopovers = ({
  subContentType,
  subContentId,
}: MyOmit<SubContentProps, "subContentField">) => {
  const subContentField: keyof SubContentFields =
    subContentType === "author"
      ? "authorIds"
      : subContentType === "collection"
      ? "collectionIds"
      : subContentType === "subject"
      ? "subjectIds"
      : "tagIds";

  const props = {
    subContentField,
    subContentId,
    subContentType,
  };

  return (
    <>
      <ArticlesPopover {...props} />
      <BlogsPopover {...props} />
      <RecordedEventsPopover {...props} />
    </>
  );
};

export default RelatedContentPopovers;

const ArticlesPopover = ({
  subContentType,
  subContentField,
  subContentId,
}: SubContentProps) => {
  const articles = useSelector(selectArticles);
  const articlesRelatedToSubContentDoc =
    filterPrimaryContentByRelationToSubContentDoc({
      content: articles,
      subContentField,
      subContentId,
    });

  return (
    <WithRelatedContent
      contentType={subContentType}
      relatedContent={articlesRelatedToSubContentDoc}
      relatedContentType="Articles"
    >
      <ContentMenuButton tooltipProps={{ text: "articles" }}>
        <ArticleIcon />
      </ContentMenuButton>
    </WithRelatedContent>
  );
};

const BlogsPopover = ({
  subContentType,
  subContentField,
  subContentId,
}: SubContentProps) => {
  const blogs = useSelector(selectBlogs);
  const blogsRelatedToSubContentDoc =
    filterPrimaryContentByRelationToSubContentDoc({
      content: blogs,
      subContentField,
      subContentId,
    });

  return (
    <WithRelatedContent
      contentType={subContentType}
      relatedContent={blogsRelatedToSubContentDoc}
      relatedContentType="Blogs"
    >
      <ContentMenuButton tooltipProps={{ text: "blogs" }}>
        <NotepadIcon />
      </ContentMenuButton>
    </WithRelatedContent>
  );
};

const RecordedEventsPopover = ({
  subContentType,
  subContentField,
  subContentId,
}: SubContentProps) => {
  const recordedEvents = useSelector(selectRecordedEvents);
  const recordedEventsRelatedToSubContentDoc =
    filterPrimaryContentByRelationToSubContentDoc({
      content: recordedEvents,
      subContentField,
      subContentId,
    });

  return (
    <WithRelatedContent
      contentType={subContentType}
      relatedContent={recordedEventsRelatedToSubContentDoc}
      relatedContentType="Recorded events"
    >
      <ContentMenuButton tooltipProps={{ text: "recorded events" }}>
        <VideoCameraIcon />
      </ContentMenuButton>
    </WithRelatedContent>
  );
};
