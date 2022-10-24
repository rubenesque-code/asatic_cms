import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectAuthorById as selectAuthorById } from "^redux/state/authors";
import { Author as AuthorType } from "^types/author";

import { MissingTranslation, MissingEntity } from "./_presentation";

type ActiveLanguageIdProp = { activeLanguageId: string };

const HandleEntityAuthors = ({
  authorIds,
  activeLanguageId,
}: {
  authorIds: string[];
} & ActiveLanguageIdProp) => {
  if (!authorIds.length) {
    return null;
  }

  return (
    <div css={[tw`flex gap-xs`]}>
      {authorIds.map((id, i) => (
        <div css={[tw`flex`]} key={id}>
          <HandleAuthor authorId={id} activeLanguageId={activeLanguageId} />
          {i < authorIds.length - 1 ? "," : null}
        </div>
      ))}
    </div>
  );
};

export default HandleEntityAuthors;

const HandleAuthor = ({
  authorId,
  activeLanguageId,
}: { authorId: string } & ActiveLanguageIdProp) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  return author ? (
    <Author activeLanguageId={activeLanguageId} author={author} />
  ) : (
    <MissingEntity subContentType="author" />
  );
};

const Author = ({
  author: { translations },
  activeLanguageId,
}: { author: AuthorType } & ActiveLanguageIdProp) => {
  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <span css={[tw`whitespace-nowrap`]}>
      {translation ? (
        translation.name
      ) : (
        <MissingTranslation tooltipText="missing author name for translation" />
      )}
    </span>
  );
};
