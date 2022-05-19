import { NextPage } from "next";
import { ToastContainer, toast, Slide } from "react-toastify";
import tw from "twin.macro";

const test: NextPage = () => {
  const createToast = () => toast.info("HELLO!!");
  return (
    <div css={[tw`border-4 w-screen h-screen`]}>
      <button onClick={createToast} type="button">
        create toast
      </button>
    </div>
  );
};

export default test;
