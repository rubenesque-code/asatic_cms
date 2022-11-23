import { ReactElement } from "react";

import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import { EntityLanguageProvider } from "^context/EntityLanguages";

import { Blog as BlogType } from "^types/blog";

const BlogProvidersWithOwnLanguages = ({
  blog,
  children,
}: {
  blog: BlogType;
  children: ReactElement;
}) => {
  return (
    <BlogSlice.Provider blog={blog}>
      {([{ id: blogId, languagesIds, translations }]) => (
        <EntityLanguageProvider entity={{ languagesIds }}>
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

export default BlogProvidersWithOwnLanguages;
