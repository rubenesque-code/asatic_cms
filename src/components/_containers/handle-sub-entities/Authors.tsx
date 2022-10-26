import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectAuthorById as selectAuthorById } from "^redux/state/authors";
import { Author as AuthorType } from "^types/author";

import { MissingTranslation, MissingEntity } from "./_presentation";

type ActiveLanguageIdProp = { activeLanguageId: string };

export const HandleEntityAuthors = ({
  authorIds,
  activeLanguageId,
}: {
  authorIds: string[];
} & ActiveLanguageIdProp) => {
  if (!authorIds.length) {
    return null;
  }

  return (
    <div css={[tw`flex gap-xs flex-wrap line-height[1em]`]}>
      {authorIds.map((id, i) => (
        <div css={[tw`flex`]} key={id}>
          <HandleAuthor
            authorId={id}
            activeLanguageId={activeLanguageId}
            useComma={authorIds.length > 1 && i < authorIds.length - 1}
          />
          {/* {i < authorIds.length - 1 ? "," : null} */}
        </div>
      ))}
    </div>
  );
};

const HandleAuthor = ({
  authorId,
  activeLanguageId,
  useComma,
}: { authorId: string; useComma: boolean } & ActiveLanguageIdProp) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  return author ? (
    <Author
      activeLanguageId={activeLanguageId}
      author={author}
      useComma={useComma}
    />
  ) : (
    <MissingEntity subContentType="author" />
  );
};

const Author = ({
  author: { translations },
  activeLanguageId,
  useComma,
}: { author: AuthorType; useComma: boolean } & ActiveLanguageIdProp) => {
  const translation = translations.find(
    (t) => t.languageId === activeLanguageId
  );

  return (
    <span>
      {translation ? (
        translation.name
      ) : (
        <MissingTranslation tooltipText="missing author name for translation" />
      )}
      {useComma ? "," : null}
    </span>
  );
};
