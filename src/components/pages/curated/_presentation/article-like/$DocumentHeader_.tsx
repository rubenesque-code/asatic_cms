import { HandleEntityAuthors } from "^components/_containers/handle-sub-entities";
import DatePicker from "^components/date-picker";
import TextArea from "^components/editors/TextArea";

import { $Authors, $Date, $Title } from "../../_styles/$ArticleLike";

export function $Date_({
  publishDate,
  updatePublishDate,
}: {
  publishDate: Date | undefined;
  updatePublishDate: (date: Date) => void;
}) {
  return (
    <$Date>
      <DatePicker
        date={publishDate}
        onChange={(date) => updatePublishDate(date)}
      />
    </$Date>
  );
}

export function $Title_({
  title,
  translationId,
  updateTitle,
}: {
  title: string | undefined;
  updateTitle: (title: string) => void;
  translationId: string;
}) {
  return (
    <$Title>
      <TextArea
        injectedValue={title}
        onBlur={updateTitle}
        placeholder="Title"
        key={translationId}
      />
    </$Title>
  );
}

export function $Authors_({
  activeLanguageId,
  authorsIds,
}: {
  authorsIds: string[];
  activeLanguageId: string;
}) {
  return (
    <$Authors>
      <HandleEntityAuthors
        authorIds={authorsIds}
        activeLanguageId={activeLanguageId}
      />
    </$Authors>
  );
}
