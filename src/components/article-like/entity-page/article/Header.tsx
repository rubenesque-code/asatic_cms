import { ReactElement } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import tw from "twin.macro";
import DocAuthorsText from "^components/authors/DocAuthorsText";

import DatePicker from "^components/date-picker";
import ArticleUI from "./UI";

export default function Header({ children }: { children: ReactElement }) {
  return <ArticleUI.Header>{children}</ArticleUI.Header>;
}

export const Date = ({
  publishDate,
  updatePublishDate,
}: {
  publishDate: Date | undefined;
  updatePublishDate: (date: Date) => void;
}) => {
  return (
    <div css={[tw`font-sans`]}>
      <DatePicker
        date={publishDate}
        onChange={(date) => updatePublishDate(date)}
      />
    </div>
  );
};

export const Title = ({
  title,
  translationId,
  updateTitle,
}: {
  title: string | undefined;
  updateTitle: (title: string) => void;
  translationId: string;
}) => {
  return (
    <ArticleUI.Title css={[tw`w-full`]}>
      <ReactTextareaAutosize
        css={[tw`outline-none w-full`]}
        value={title}
        onChange={(e) => {
          const title = e.target.value;
          updateTitle(title);
        }}
        placeholder="Title"
        key={translationId}
      />
    </ArticleUI.Title>
  );
};

export const Authors = ({
  activeLanguageId,
  authorsIds,
}: {
  authorsIds: string[];
  activeLanguageId: string;
}) => {
  return (
    <ArticleUI.Authors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </ArticleUI.Authors>
  );
};
