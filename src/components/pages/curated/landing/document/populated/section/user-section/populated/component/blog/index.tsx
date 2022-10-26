import { useSelector } from "^redux/hooks";
import { selectBlogById } from "^redux/state/blogs";

import LandingCustomSectionComponentSlice from "^context/landing/LandingCustomSectionComponentContext";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";

import { Blog } from "^types/blog";

import { selectTranslationForActiveLanguage } from "^helpers/displayContent";

import SiteLanguage from "^components/SiteLanguage";
import MissingEntity_ from "../_containers/MissingEntity_";
import Card from "./Card";

const Content = () => {
  const [{ docId: blogId }] = LandingCustomSectionComponentSlice.useContext();

  const blog = useSelector((state) => selectBlogById(state, blogId));

  return blog ? <Found blog={blog} /> : <MissingEntity_ entityType="blog" />;
};

export default Content;

const Found = ({ blog: blog }: { blog: Blog }) => {
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
        <Card />
      </BlogTranslationSlice.Provider>
    </BlogSlice.Provider>
  );
};
