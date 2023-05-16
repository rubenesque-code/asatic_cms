import tw from "twin.macro";

const s_input = {
  input: tw`outline-none border rounded-md`,
  transition: tw`transition-all ease-in duration-75`,
  focused: tw`focus:outline-none focus:border-blue-500 focus:border-2 focus:px-3 focus:py-2`,
  unFocused: tw`px-1 py-0.5 border-blue-200`,
};

export default s_input;
