import { ReactElement } from "react";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { Blog } from "^types/blog";

import SiteLanguage from "^components/SiteLanguage";

const BlogProvidersWithSiteLanguages = ({
  blog,
  children,
}: {
  blog: Blog;
  children: ReactElement;
}) => {
  const { id: siteLanguageId } = SiteLanguage.useContext();

  return (
    <BlogSlice.Provider blog={blog}>
      <BlogTranslationSlice.Provider
        blogId={blog.id}
        translation={selectTranslationForActiveLanguage(
          blog.translations,
          siteLanguageId
        )}
      >
        {children}
      </BlogTranslationSlice.Provider>
    </BlogSlice.Provider>
  );
};

export default BlogProvidersWithSiteLanguages;
