import { JSONContent } from "@tiptap/core";
import { FileText } from "phosphor-react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectBlogs } from "^redux/state/blogs";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import useFindDocsUsedInCustomLandingSections from "^hooks/useFindDocsUsedInCustomLandingSections";

import { landingColorThemes } from "^data/landing";

import { arrayDivergence, formatDateDMYStr, mapIds } from "^helpers/general";
import {
  getArticleSummaryFromTranslation,
  selectTranslationForActiveLanguage,
} from "^helpers/article";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import DivHover from "^components/DivHover";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import ContentMenu from "^components/menus/Content";
import MissingText from "^components/MissingText";
import SiteLanguage from "^components/SiteLanguage";
import StatusLabel from "^components/StatusLabel";

import AutoSection from ".";
import Swiper from "./Swiper";

export default function Articles() {
  return (
    <AutoSection.Container
      colorTheme="blue"
      swiper={<BlogsSwiper />}
      title="Blogs"
      moreFromText="More from blogs"
    />
  );
}

const BlogsSwiper = () => {
  const blogs = useSelector(selectBlogs);

  const usedBlogsIds = useFindDocsUsedInCustomLandingSections("blog");
  const blogsIds = [...new Set(mapIds(blogs))];
  const unusedBlogsIds = arrayDivergence(blogsIds, usedBlogsIds);

  const blogsOrderedIds = [...unusedBlogsIds, ...usedBlogsIds];
  const blogsOrdered = blogsOrderedIds.map(
    (id) => blogs.find((a) => a.id === id)!
  );

  return (
    <Swiper
      colorTheme="cream"
      elements={blogsOrdered.map((blog) => (
        <BlogSlice.Provider blog={blog} key={blog.id}>
          <Blog />
        </BlogSlice.Provider>
      ))}
    />
  );
};

function Blog() {
  const [{ id: blogId, translations }] = BlogSlice.useContext();
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForActiveLanguage(
    translations,
    siteLanguageId
  );

  return (
    <BlogTranslationSlice.Provider translation={translation} blogId={blogId}>
      <DivHover styles={tw`h-full`}>
        {(isHovered) => (
          <>
            <Swiper.Element>
              <BlogContent />
            </Swiper.Element>
            <BlogMenu articleIsHovered={isHovered} />
          </>
        )}
      </DivHover>
    </BlogTranslationSlice.Provider>
  );
}

const BlogMenu = ({ articleIsHovered }: { articleIsHovered: boolean }) => {
  const [, { routeToEditPage }] = BlogSlice.useContext();

  const show = articleIsHovered;

  return (
    <ContentMenu show={show} styles={tw`top-0 right-0`}>
      <ContentMenu.Button
        onClick={routeToEditPage}
        tooltipProps={{
          text: "go to edit page",
          placement: "left",
          type: "action",
        }}
      >
        <FileText />
      </ContentMenu.Button>
    </ContentMenu>
  );
};

function BlogContent() {
  const [{ publishDate, status }] = BlogSlice.useContext();
  return (
    <>
      <div css={[tw`inline-block mb-sm`]}>
        <StatusLabel publishDate={publishDate} status={status} />
      </div>
      <Title />
      <Authors />
      <Date />
      <Summary />
    </>
  );
}

function Title() {
  const [{ title }] = BlogTranslationSlice.useContext();

  return (
    <h3 css={[tw`text-3xl`, landingColorThemes.cream.text]}>
      {title ? (
        title
      ) : (
        <div css={[tw`flex items-baseline gap-xs`]}>
          <span css={[tw`text-gray-placeholder`]}>Title...</span>
          <MissingText tooltipText="missing title" fontSize={tw`text-base`} />
        </div>
      )}
    </h3>
  );
}

const Authors = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ languageId }] = BlogTranslationSlice.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <div css={[tw`text-2xl text-articleText mt-xxxs`]}>
      <DocAuthorsText authorIds={authorsIds} docActiveLanguageId={languageId} />
    </div>
  );
};

const Date = () => {
  const [{ publishDate }] = BlogSlice.useContext();

  const dateStr = publishDate ? formatDateDMYStr(publishDate) : null;

  return (
    <p css={[tw`font-sans tracking-wider font-light text-articleText mt-xs`]}>
      {dateStr ? (
        dateStr
      ) : (
        <span css={[tw`flex items-center gap-sm`]}>
          <span css={[tw`text-gray-placeholder`]}>date...</span>
          <MissingText tooltipText="missing publish date" />
        </span>
      )}
    </p>
  );
};

// todo: diff in line heights between summary written manually and that from article body

const Summary = () => {
  const [{ authorsIds }] = BlogSlice.useContext();

  const isAuthor = authorsIds.length;

  const [translation, { updateLandingAutoSummary }] =
    BlogTranslationSlice.useContext();

  const initialContent =
    getArticleSummaryFromTranslation(translation, "auto") || undefined;

  const onUpdate = (text: JSONContent) =>
    updateLandingAutoSummary({
      summary: text,
    });

  return (
    <div css={[tw`relative text-articleText mt-xs`]}>
      <SimpleTipTapEditor
        initialContent={initialContent}
        onUpdate={onUpdate}
        placeholder="summary here..."
        lineClamp={isAuthor ? "line-clamp-4" : "line-clamp-6"}
        key={translation.id}
      />
    </div>
  );
};
