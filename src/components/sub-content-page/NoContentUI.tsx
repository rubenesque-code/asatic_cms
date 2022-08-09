import NoContentTextUI from "./NoContentTextUI";

const NoContentUI = ({ children }: { children: string }) => (
  <NoContentTextUI>{`No ${children}`}</NoContentTextUI>
);

export default NoContentUI;
