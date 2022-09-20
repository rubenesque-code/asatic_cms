import { ReactElement } from "react";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { Blog } from "^types/blog";

import DocLanguages from "^components/DocLanguages";

const BlogProviders = ({
  blog,
  children,
}: {
  blog: Blog;
  children: ReactElement;
}) => {
  return (
    <BlogSlice.Provider blog={blog}>
      {([{ id: blogId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <BlogTranslationSlice.Provider
              blogId={blogId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </BlogTranslationSlice.Provider>
          )}
        </DocLanguages.Provider>
      )}
    </BlogSlice.Provider>
  );
};

export default BlogProviders;
