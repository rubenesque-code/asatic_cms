import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import { Blog as BlogType } from "^types/blog";

import Summary from "./Summary";
import Menu from "./Menu";
import Status from "./Status";

const Blog = ({
  blog,
  containerIsHovered,
}: {
  blog: BlogType;
  containerIsHovered: boolean;
}) => {
  const [subjectTranslation] = SubjectTranslationSlice.useContext();

  return (
    <BlogSlice.Provider blog={blog}>
      <BlogTranslationSlice.Provider
        blogId={blog.id}
        translation={selectTranslationForActiveLanguage(
          blog.translations,
          subjectTranslation.languageId
        )}
      >
        <>
          <Status />
          <Summary />
          <Menu isShowing={containerIsHovered} />
        </>
      </BlogTranslationSlice.Provider>
    </BlogSlice.Provider>
  );
};

export default Blog;
