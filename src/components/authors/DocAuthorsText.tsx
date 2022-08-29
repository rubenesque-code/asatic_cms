import tw from "twin.macro";
import MissingText from "^components/MissingText";
import SubContentMissingFromStore from "^components/SubContentMissingFromStore";
import { useSelector } from "^redux/hooks";
import { selectAuthorById as selectAuthorById } from "^redux/state/authors";
import { Author as AuthorType } from "^types/author";

type DocActiveLanguageIdProp = { docActiveLanguageId: string };

const DocAuthorsText = ({
  authorIds,
  docActiveLanguageId,
}: {
  authorIds: string[];
} & DocActiveLanguageIdProp) => {
  if (!authorIds.length) {
    return null;
  }

  return (
    <div css={[tw`flex gap-xs`]}>
      {authorIds.map((id, i) => (
        <div css={[tw`flex`]} key={id}>
          <HandleAuthor
            authorId={id}
            docActiveLanguageId={docActiveLanguageId}
          />
          {i < authorIds.length - 1 ? "," : null}
        </div>
      ))}
    </div>
  );
};

export default DocAuthorsText;

const HandleAuthor = ({
  authorId,
  docActiveLanguageId,
}: { authorId: string } & DocActiveLanguageIdProp) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  return author ? (
    <Author docActiveLanguageId={docActiveLanguageId} author={author} />
  ) : (
    <SubContentMissingFromStore subContentType="author" />
  );
};

const Author = ({
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
        <MissingText tooltipText="missing author name for translation" />
      )}
    </>
  );
};
