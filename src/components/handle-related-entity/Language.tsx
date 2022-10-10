import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";

const HandleDocLanguage = ({ languageId }: { languageId: string }) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return (
    <>
      {language ? (
        language.name
      ) : (
        <SubContentMissingFromStore subContentType="language" />
      )}
    </>
  );
};

export default HandleDocLanguage;
