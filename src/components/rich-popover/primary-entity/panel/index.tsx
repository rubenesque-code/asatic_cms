import tw, { TwStyle } from "twin.macro";

import { $PanelContainer } from "^components/rich-popover/_styles";
import Meta from "./Meta";
import FiltersAndTable from "./filters-and-table";

const Panel = ({
  containerStyles = tw`w-[96vw] max-w-[96vw]`,
}: {
  containerStyles?: TwStyle;
}) => (
  <$PanelContainer css={[containerStyles]}>
    <Meta />
    <FiltersAndTable />
  </$PanelContainer>
);

export default Panel;
