import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { useSelector } from "^redux/hooks";
import { selectAuthorById as selectAuthorById } from "^redux/state/authors";
import { Author as AuthorType } from "^types/author";

type DocActiveLanguageIdProp = { docActiveLanguageId: string };

/* const HandleDocAuthors = ({
  authorIds,
  docActiveLanguageId,
}: {
  authorIds: string[];
} & DocActiveLanguageIdProp) => {
  return authorIds.map((id) => (
    <HandleIsAuthor
      authorId={id}
      docActiveLanguageId={docActiveLanguageId}
      key={id}
    />
  ));
};

export default HandleDocAuthors; */

const HandleDocAuthor = ({
  authorId,
  docActiveLanguageId,
}: { authorId: string } & DocActiveLanguageIdProp) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  return author ? (
    <HandleTranslation
      docActiveLanguageId={docActiveLanguageId}
      author={author}
    />
  ) : (
    <SubContentMissingFromStore subContentType="author" />
  );
};

export default HandleDocAuthor;

const HandleTranslation = ({
  author: { translations },
  docActiveLanguageId,
}: { author: AuthorType } & DocActiveLanguageIdProp) => {
  const translation = translations.find(
    (t) => t.languageId === docActiveLanguageId
  );

  return (
    <>
      {translation ? (
        translation.name
      ) : (
        <MissingText tooltipText="missing translation for author" />
      )}
    </>
  );
};
