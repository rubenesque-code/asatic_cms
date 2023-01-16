import { HandleEntityAuthors } from "^components/_containers/handle-sub-entities";
import DatePicker from "^components/date-picker";
import TextArea from "^components/editors/TextArea";

import {
  $Authors,
  $Date,
  $Title,
} from "^components/pages/curated/document/_styles/$articleLikeDocument";

export function $Date_({
  publishDate,
  updatePublishDate,
  languageId,
}: {
  publishDate: Date | undefined;
  updatePublishDate: (date: Date) => void;
  languageId: string;
}) {
  return (
    <$Date>
      <DatePicker
        date={publishDate}
        onChange={(date) => updatePublishDate(date)}
        languageId={languageId}
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
