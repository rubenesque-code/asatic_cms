import InputSelectCombo from "./input-select-combo";
import Meta from "./Meta";
import RelatedType from "./related-type";
import { $PanelContainer } from "./_styles";

const Panel = () => (
  <$PanelContainer>
    <Meta />
    <RelatedType />
    <InputSelectCombo />
  </$PanelContainer>
);

export default Panel;
