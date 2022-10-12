import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectBlogById } from "^redux/state/blogs";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { Blog as BlogType } from "^types/blog";

import SiteLanguage from "^components/SiteLanguage";
import Blog from "./Blog";

const SwiperSlideContent = ({ blogId }: { blogId: string }) => {
  const blog = useSelector((state) => selectBlogById(state, blogId))!;

  return (
    <BlogProviders blog={blog} key={blog.id}>
      <Blog />
    </BlogProviders>
  );
};

export default SwiperSlideContent;

const BlogProviders = ({
  blog: blog,
  children,
}: {
  children: ReactElement;
  blog: BlogType;
}) => {
  const { id: siteLanguageId } = SiteLanguage.useContext();

  return (
    <BlogSlice.Provider blog={blog} key={blog.id}>
      {([{ id: blogId, translations }]) => (
        <BlogTranslationSlice.Provider
          blogId={blogId}
          translation={selectTranslationForActiveLanguage(
            translations,
            siteLanguageId
          )}
        >
          {children}
        </BlogTranslationSlice.Provider>
      )}
    </BlogSlice.Provider>
  );
};
