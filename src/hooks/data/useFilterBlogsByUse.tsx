import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/blogs";
import { Blog } from "^types/blog";

const useFilterBlogsByUse = (
  field: keyof Pick<
    Blog,
    "authorIds" | "collectionIds" | "subjectIds" | "tagIds"
  >,
  docId: string
) => {
  const allBlogs = useSelector(selectAll);
  const filteredBlogs = allBlogs.filter((blog) => {
    const isDocBlog = blog[field].includes(docId);

    return isDocBlog;
  });

  return filteredBlogs;
};

export default useFilterBlogsByUse;
