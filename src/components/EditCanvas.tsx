import { ReactElement } from "react";
import tw from "twin.macro";

const EditCanvas = ({ children }: { children: ReactElement }) => {
  return (
    <div css={[s.background]}>
      <div css={[s.canvas]}>{children}</div>
    </div>
  );
};

export default EditCanvas;

const s = {
  background: tw`flex-grow grid place-items-center bg-gray-50 pt-md border-t-2 border-gray-200`,
  canvas: tw`w-[800px] max-w-[800px] h-[95%] bg-white shadow-md`,
};
