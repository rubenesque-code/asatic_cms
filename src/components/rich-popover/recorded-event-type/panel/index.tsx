import tw from "twin.macro";

import { $PanelContainer } from "^components/rich-popover/_styles";
import InputSelectCombo from "./input-select-combo";
import Meta from "./Meta";
import RelatedType from "./related-type";

const Panel = () => (
  <$PanelContainer css={[tw`w-[700px]`]}>
    <Meta />
    <RelatedType />
    <InputSelectCombo />
  </$PanelContainer>
);

export default Panel;
