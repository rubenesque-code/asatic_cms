import { $PanelContainer } from "^components/rich-popover/_styles";
import Meta from "./Meta";
import FiltersAndTable from "./filters-and-table";

const Panel = () => (
  <$PanelContainer>
    <Meta />
    <FiltersAndTable />
  </$PanelContainer>
);

export default Panel;
