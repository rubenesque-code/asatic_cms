import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";

import TextArea from "^components/editors/TextArea";

import { $Container, $Title } from "./_styles";

const Banner = () => {
  const [{ name }, { updateName }] = SubjectTranslationSlice.useContext();

  return (
    <$Container>
      <$Title>
        <TextArea
          injectedValue={name}
          placeholder="Title"
          onBlur={(name) => updateName({ name })}
        />
      </$Title>
    </$Container>
  );
};

export default Banner;
