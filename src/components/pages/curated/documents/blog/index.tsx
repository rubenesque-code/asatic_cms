import { useSelector } from "^redux/hooks";
import { selectBlogById } from "^redux/state/blogs";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import BlogProvidersWithOwnLanguages from "^components/_containers/blogs/ProvidersWithOwnLanguages";
import StickyCanvas_ from "^document-pages/_containers/StickyCanvas_";
import Header from "./Header";
import Document from "./document";
import { $PageContainer, $EntityTypeWatermark } from "../_styles/$page";

const BlogPage = () => {
  const blogId = useGetSubRouteId();
  const blog = useSelector((state) => selectBlogById(state, blogId))!;

  return (
    <$PageContainer>
      <BlogProvidersWithOwnLanguages blog={blog}>
        <>
          <Header />
          <StickyCanvas_>
            <>
              <Document />
              <$EntityTypeWatermark>Blog</$EntityTypeWatermark>
            </>
          </StickyCanvas_>
        </>
      </BlogProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default BlogPage;
