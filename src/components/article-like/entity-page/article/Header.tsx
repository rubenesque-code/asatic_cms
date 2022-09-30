import { ReactElement } from "react";

import DocAuthorsText from "^components/authors/DocAuthorsText";
import DatePicker from "^components/date-picker";
import TextArea from "^components/editors/TextArea";

import { HeaderContainer, Date, Title, Authors } from "./styles/article";

export default function Header({ children }: { children: ReactElement }) {
  return <HeaderContainer>{children}</HeaderContainer>;
}

Header.Date = function Date_({
  publishDate,
  updatePublishDate,
}: {
  publishDate: Date | undefined;
  updatePublishDate: (date: Date) => void;
}) {
  return (
    <Date>
      <DatePicker
        date={publishDate}
        onChange={(date) => updatePublishDate(date)}
      />
    </Date>
  );
};

Header.Title = function Title_({
  title,
  translationId,
  updateTitle,
}: {
  title: string | undefined;
  updateTitle: (title: string) => void;
  translationId: string;
}) {
  return (
    <Title>
      <TextArea
        injectedValue={title}
        onBlur={updateTitle}
        placeholder="Title"
        key={translationId}
      />
    </Title>
  );
};

Header.Authors = function Authors_({
  activeLanguageId,
  authorsIds,
}: {
  authorsIds: string[];
  activeLanguageId: string;
}) {
  return (
    <Authors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </Authors>
  );
};
