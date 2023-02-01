import ArticleEditor from "^components/editors/tiptap/RichEditor";
import { useDispatch, useSelector } from "^redux/hooks";
import { selectAll, updateText } from "^redux/state/about";
import SiteLanguage from "^components/SiteLanguage";
import tw from "twin.macro";

const Document = () => {
  const siteLanguage = SiteLanguage.useContext();

  const dispatch = useDispatch();

  const aboutPageData = useSelector(selectAll)[0];
  console.log("aboutPageData:", aboutPageData);
  const translation = aboutPageData.translations.find(
    (translation) => translation.languageId === siteLanguage.id
  )!;
  console.log("translation:", translation);

  return (
    <div css={[tw`pt-3xl`]}>
      <ArticleEditor
        initialContent={translation.text}
        onUpdate={(text) =>
          dispatch(updateText({ text, translationId: translation.id }))
        }
        placeholder="About page text..."
        key={translation.id}
      />
    </div>
  );
};

export default Document;
