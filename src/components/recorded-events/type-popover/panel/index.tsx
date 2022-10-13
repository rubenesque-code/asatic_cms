import tw from "twin.macro";

import InputSelectCombo from "./input-select-combo";
import Meta from "./Meta";
import RelatedType from "./RelatedType";

const Panel = () => {
  return (
    <$Container>
      <Meta />
      <RelatedType />
      <InputSelectCombo />
    </$Container>
  );
};

export default Panel;

const $Container = tw.div`min-w-[800px] max-w-[94vw] p-md bg-white shadow-lg rounded-md border font-sans`;
