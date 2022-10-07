import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import DocLanguages from "^components/DocLanguages";
import TextArea from "^components/editors/TextArea";
import DocAuthorsText from "^components/authors/DocAuthorsText";

import {
  Header as HeaderContainer,
  DocTypeHeading,
  Title as Title_,
  Authors as Authors_,
} from "./styles";

// todo: need to add a Date

export default function Header() {
  return (
    <HeaderContainer>
      <DocTypeHeading>Asatic Talks & Interviews</DocTypeHeading>
      <Title />
      <Authors />
    </HeaderContainer>
  );
}

const Title = () => {
  const [{ id: translationId, title }, { updateTitle }] =
    RecordedEventTranslationSlice.useContext();

  return (
    <Title_>
      <TextArea
        injectedValue={title}
        onBlur={(title) => updateTitle({ title })}
        placeholder="Title"
        key={translationId}
      />
    </Title_>
  );
};

const Authors = () => {
  const [{ authorsIds }] = RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  if (!authorsIds.length) {
    return null;
  }

  return (
    <Authors_>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </Authors_>
  );
};
