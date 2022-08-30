import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectBlogById } from "^redux/state/blogs";

import useGetSubRouteId from "^hooks/useGetSubRouteId";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import ContainersUI from "./ContainersUI";
import HeaderUnpopulated from "./Header";
import DocLanguages from "^components/DocLanguages";
import BlogUI from "./BlogUI";
import DocAuthorsText from "^components/authors/DocAuthorsText";
import DatePicker from "^components/date-picker";
import InlineTextEditor from "^components/editors/Inline";
import BodyEmpty from "./BodyEmpty";
import Body from "./Body";
import BlogSlice from "^context/blogs/BlogContext";
import BlogTranslationSlice from "^context/blogs/BlogTranslationContext";
import useBlogPageTopControls from "^hooks/pages/useBlogPageTopControls";

const BlogPageContent = () => {
  return (
    <ContainersUI.FillScreenHeight>
      <Providers>
        <>
          <Header />
          <ContainersUI.ContentCanvas>
            <Blog />
          </ContainersUI.ContentCanvas>
        </>
      </Providers>
    </ContainersUI.FillScreenHeight>
  );
};

export default BlogPageContent;

const Providers = ({ children }: { children: ReactElement }) => {
  const blogId = useGetSubRouteId();
  const blog = useSelector((state) => selectBlogById(state, blogId))!;

  return (
    <BlogSlice.Provider blog={blog}>
      {([{ languagesIds, translations }]) => (
        <DocLanguages.SelectProvider docLanguagesIds={languagesIds}>
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
        </DocLanguages.SelectProvider>
      )}
    </BlogSlice.Provider>
  );
};

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData: { isError, isLoading, isSuccess },
  } = useBlogPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <HeaderUnpopulated
      isChange={isChange}
      save={save}
      saveMutationData={{
        isError,
        isLoading,
        isSuccess,
      }}
      undo={undo}
    />
  );
};

const Blog = () => {
  const [{ body }] = BlogTranslationSlice.useContext();

  return (
    <BlogUI>
      <>
        <BlogUI.Header>
          <Date />
          <Title />
          <Authors />
        </BlogUI.Header>
        {body.length ? (
          <Body.Provider>
            <Body.Body />
          </Body.Provider>
        ) : (
          <BodyEmpty />
        )}
      </>
    </BlogUI>
  );
};

const Date = () => {
  const [{ publishDate }, { updatePublishDate }] = BlogSlice.useContext();

  return (
    <DatePicker
      date={publishDate}
      onChange={(date) => updatePublishDate({ date })}
    />
  );
};

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    BlogTranslationSlice.useContext();

  return (
    <BlogUI.Title>
      <InlineTextEditor
        injectedValue={title || ""}
        onUpdate={(title) => updateTitle({ title })}
        placeholder="Title"
        key={translationId}
      />
    </BlogUI.Title>
  );
};

const Authors = () => {
  const [{ authorsIds }] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useSelectContext();

  return (
    <BlogUI.Authors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </BlogUI.Authors>
  );
};
