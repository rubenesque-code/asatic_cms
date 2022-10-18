import { ReactElement } from "react";

import { useDeleteBlogMutation } from "^redux/services/blogs";
import { useSelector } from "^redux/hooks";
import { selectBlogById } from "^redux/state/blogs";

import BlogProvidersWithTranslationLanguages from "../BlogProvidersWithTranslationLanguages";
import { DeleteMutationProvider } from "^context/DeleteMutationContext";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import {
  $PageContainer,
  $EntityTypeWatermark,
} from "^components/display-entity/entity-page/_styles";
import StickyCanvas_ from "^components/display-entity/entity-page/_containers/StickyCanvas_";
import Header from "./Header";
import Blog from "./article";

const BlogPageContent = () => {
  return (
    <$PageContainer>
      <BlogProviders>
        <MutationProviders>
          <>
            <Header />
            <StickyCanvas_>
              <>
                <Blog />
                <$EntityTypeWatermark>Blog</$EntityTypeWatermark>
              </>
            </StickyCanvas_>
          </>
        </MutationProviders>
      </BlogProviders>
    </$PageContainer>
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

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const deleteMutation = useDeleteBlogMutation();

  return (
    <DeleteMutationProvider mutation={deleteMutation}>
      <>{children}</>
    </DeleteMutationProvider>
  );
};
