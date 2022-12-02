import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";

import TextArea from "^components/editors/TextArea";

import { $Container, $Title } from "./_styles";

const Banner = () => {
  const [{ title }, { updateTitle }] = SubjectTranslationSlice.useContext();

  return (
    <$Container>
      <$Title>
        <TextArea
          injectedValue={title}
          placeholder="Title"
          onBlur={(title) => updateTitle({ title })}
        />
      </$Title>
    </$Container>
  );
};

export default Banner;
