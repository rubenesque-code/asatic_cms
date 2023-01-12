import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";

import TextArea from "^components/editors/TextArea";
import tw from "twin.macro";

const $Container = tw.div`py-2xl flex justify-center border-b`;
const $Title = tw.h1`max-w-[1120px] font-serif-eng text-4xl text-gray-600`;

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
