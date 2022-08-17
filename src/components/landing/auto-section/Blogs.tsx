import { JSONContent } from "@tiptap/core";
import { Notepad } from "phosphor-react";
import tw from "twin.macro";
import ArticleLikeContentStatusLabel from "^components/article-like-content/StatusLabel";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import DivHover from "^components/DivHover";
import SimpleTipTapEditor from "^components/editors/tiptap/SimpleEditor";
import ContentMenu from "^components/menus/Content";
import MissingText from "^components/MissingText";
import SiteLanguage from "^components/SiteLanguage";
import { BlogProvider, useBlogContext } from "^context/blogs/BlogContext";
import {
  BlogTranslationProvider,
  useBlogTranslationContext,
} from "^context/blogs/BlogTranslationContext";
import { landingColorThemes } from "^data/landing";
import { selectTranslationForSiteLanguage } from "^helpers/article";
import { getSummaryFromArticleLikeContentBody } from "^helpers/article-like-content";
import { arrayDivergence, formatDateDMYStr, mapIds } from "^helpers/general";
import useArticleLikeContentStatus from "^hooks/useArticleLikeContentStatus";
import useFindDocsUsedInCustomLandingSections from "^hooks/useFindDocsUsedInCustomLandingSections";
import { useSelector } from "^redux/hooks";
import {
  selectAll as selectBlogs,
  selectTotal as selectTotalBlogs,
} from "^redux/state/blogs";
import AutoSection from "./AutoSection";
import Swiper from "./Swiper";

export default function Blogs() {
  const numBlogs = useSelector(selectTotalBlogs);

  return numBlogs ? (
    <AutoSection.Container
      colorTheme="blue"
      swiper={<BlogsSwiper />}
      title="Blogs"
      moreFromText="More from blogs"
    />
  ) : (
    <AutoSection.Empty colorTheme="blue" docType="blogs" />
  );
}

const BlogsSwiper = () => {
  const blogs = useSelector(selectBlogs);

  const usedBlogsIds = useFindDocsUsedInCustomLandingSections("blog");
  const blogsIds = [...new Set(mapIds(blogs))];
  const unusedBlogsIds = arrayDivergence(blogsIds, usedBlogsIds);

  const articlesBlogsIds = [...unusedBlogsIds, ...usedBlogsIds];
  const blogsOrdered = articlesBlogsIds.map(
    (id) => blogs.find((a) => a.id === id)!
  );

  // could order by date + translation (for site language)

  return (
    <Swiper
      colorTheme="cream"
      elements={blogsOrdered.map((blog) => (
        <BlogProvider blog={blog} key={blog.id}>
          <Blog />
        </BlogProvider>
      ))}
    />
  );
};

function Blog() {
  const [{ id: blogId, translations }] = useBlogContext();
  const { id: siteLanguageId } = SiteLanguage.useContext();

  const translation = selectTranslationForSiteLanguage(
    translations,
    siteLanguageId
  );

  return (
    <BlogTranslationProvider translation={translation} blogId={blogId}>
      <DivHover styles={tw`h-full`}>
        {(isHovered) => (
          <>
            <Swiper.Element>
              <BlogContent />
            </Swiper.Element>
            <BlogMenu blogIsHovered={isHovered} />
          </>
        )}
      </DivHover>
    </BlogTranslationProvider>
  );
}

const BlogMenu = ({ blogIsHovered }: { blogIsHovered: boolean }) => {
  const [, { routeToEditPage }] = useBlogContext();

  const show = blogIsHovered;

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
        <Notepad />
      </ContentMenu.Button>
    </ContentMenu>
  );
};

function BlogContent() {
  const [blog] = useBlogContext();
  const status = useArticleLikeContentStatus(blog);

  return (
    <>
      <div css={[tw`inline-block mb-sm`]}>
        <ArticleLikeContentStatusLabel
          publishDate={blog.publishInfo.date}
          status={status}
          includeNewType={false}
          showPublished={false}
        />
      </div>
      <BlogTitle />
      <BlogAuthors />
      <BlogDate />
      <BlogSummary />
    </>
  );
}

function BlogTitle() {
  const [{ title }] = useBlogTranslationContext();

  return (
    <h3 css={[tw`text-3xl`, landingColorThemes.blue.text]}>
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

const BlogAuthors = () => {
  const [{ authorIds }] = useBlogContext();
  const [{ languageId }] = useBlogTranslationContext();

  if (!authorIds.length) {
    return null;
  }

  return (
    <div css={[tw`text-2xl text-articleText mt-xxxs`]}>
      <DocAuthorsText authorIds={authorIds} docActiveLanguageId={languageId} />
    </div>
  );
};

const BlogDate = () => {
  const [
    {
      publishInfo: { date },
    },
  ] = useBlogContext();
  const dateStr = date ? formatDateDMYStr(date) : null;

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

const BlogSummary = () => {
  const [{ authorIds }] = useBlogContext();

  const isAuthor = authorIds.length;

  const [translation, { updateSummary }] = useBlogTranslationContext();
  console.log("translation:", translation);

  const {
    body,
    landingPage: { autoSummary },
  } = translation;

  const bodyText = getSummaryFromArticleLikeContentBody(body);
  console.log("bodyText:", bodyText);

  const initialContent = autoSummary || bodyText || undefined;

  const onUpdate = (text: JSONContent) =>
    updateSummary({
      summary: text,
      summaryType: "auto",
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
