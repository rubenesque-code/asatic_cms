import NoContentTextUI from "./NoContentTextUI";

const NoContentForFilterUI = ({ children }: { children: string }) => (
  <NoContentTextUI>{`No ${children} for filter`}</NoContentTextUI>
);

export default NoContentForFilterUI;
