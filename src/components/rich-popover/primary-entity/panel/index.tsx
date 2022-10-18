import tw from "twin.macro";

import { $PanelContainer } from "^components/rich-popover/_styles";
import Meta from "./Meta";
import FiltersAndTable from "./filters-and-table";

const Panel = () => (
  <$PanelContainer css={[tw`w-[96vw] max-w-[96vw]`]}>
    <Meta />
    <FiltersAndTable />
  </$PanelContainer>
);

export default Panel;
