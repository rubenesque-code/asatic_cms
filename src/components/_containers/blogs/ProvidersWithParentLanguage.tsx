import { ReactElement } from "react";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { Blog } from "^types/blog";

import { EntityLanguageProvider } from "^context/EntityLanguages";

const BlogProvidersWithParentLanguage = ({
  blog,
  children,
  parentLanguageId,
}: {
  blog: Blog;
  children: ReactElement;
  parentLanguageId: string;
}) => {
  return (
    <BlogSlice.Provider blog={blog}>
      {([{ id: blogId, languagesIds, translations }]) => (
        <EntityLanguageProvider
          entity={{ languagesIds }}
          parentLanguageId={parentLanguageId}
        >
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
        </EntityLanguageProvider>
      )}
    </BlogSlice.Provider>
  );
};

export default BlogProvidersWithParentLanguage;
