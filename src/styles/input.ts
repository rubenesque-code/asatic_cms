import tw from "twin.macro";

const s_input = {
  input: tw`outline-none border rounded-sm`,
  transition: tw`transition-all ease-in duration-75`,
  focused: tw`focus:outline-none focus:border-gray-500 focus:px-3 focus:py-2`,
  unFocused: tw`p-0 border-transparent`,
};

export default s_input;
