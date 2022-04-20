import tw from "twin.macro";

const Overlay = ({ show }: { show: boolean }) => {
  return <div css={[s.static, show ? s.show : s.hide]} />;
};

export default Overlay;

const s = {
  static: tw`fixed transition-opacity z-40 ease-in-out duration-75 top-0 left-0 w-full h-screen bg-overlayLight`,
  show: tw`opacity-100`,
  hide: tw`opacity-0 hidden`,
};
