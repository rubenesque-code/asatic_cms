import tw from "twin.macro";

import { $PanelContainer } from "^components/rich-popover/_styles";
import InputSelectCombo from "./input-select-combo";
import Meta from "./Meta";
import RelatedEntities from "./related-authors";

// todo Weds: findished popovers? go back to collection page. subject page: make trans for each site lang required?

const Panel = () => (
  <$PanelContainer css={[tw`w-[700px]`]}>
    <Meta />
    <RelatedEntities />
    <InputSelectCombo />
  </$PanelContainer>
);

export default Panel;
