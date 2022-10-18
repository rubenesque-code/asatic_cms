import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectBlogById } from "^redux/state/blogs";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import BlogProvidersWithTranslationLanguages from "../BlogProvidersWithTranslationLanguages";

import ContainersUI from "^components/article-like/entity-page/ContainersUI";
import Canvas from "^components/article-like/entity-page/Canvas";
import { $EntityTypeWatermark } from "^components/display-entity/entity-page/_styles";

import Header from "./Header";
import Blog from "./article";

const BlogPageContent = () => {
  return (
    <ContainersUI.ScreenHeight>
      <BlogProviders>
        <>
          <Header />
          <Canvas>
            <>
              {<Blog />}
              <$EntityTypeWatermark>Blog</$EntityTypeWatermark>
            </>
          </Canvas>
        </>
      </BlogProviders>
    </ContainersUI.ScreenHeight>
  );
};

export default BlogPageContent;

const BlogProviders = ({ children }: { children: ReactElement }) => {
  const blogId = useGetSubRouteId();
  const blog = useSelector((state) => selectBlogById(state, blogId))!;

  return (
    <BlogProvidersWithTranslationLanguages blog={blog}>
      {children}
    </BlogProvidersWithTranslationLanguages>
  );
};
