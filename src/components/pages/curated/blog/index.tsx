import { useDeleteArticleMutation } from "^redux/services/articles";

import { useSelector } from "^redux/hooks";
import { selectBlogById } from "^redux/state/blogs";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { DeleteMutationProvider } from "^context/DeleteMutationContext";

import BlogProvidersWithOwnLanguages from "^components/_containers/blogs/ProvidersWithOwnLanguages";
import { $PageContainer, $EntityTypeWatermark } from "../_styles";
import StickyCanvas_ from "../_containers/StickyCanvas_";
import Header from "./Header";
import Document from "./document";

const BlogPage = () => {
  const blogId = useGetSubRouteId();
  const blog = useSelector((state) => selectBlogById(state, blogId))!;

  const deleteMutation = useDeleteArticleMutation();

  return (
    <$PageContainer>
      <BlogProvidersWithOwnLanguages blog={blog}>
        <DeleteMutationProvider mutation={deleteMutation}>
          <>
            <Header />
            <StickyCanvas_>
              <>
                <Document />
                <$EntityTypeWatermark>Blog</$EntityTypeWatermark>
              </>
            </StickyCanvas_>
          </>
        </DeleteMutationProvider>
      </BlogProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default BlogPage;
