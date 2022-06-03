import tw from "twin.macro";

const s_button = {
  selectors: tw`hover:bg-gray-100 active:bg-gray-200 transition-all ease-in-out duration-75`,
  icon: tw`p-xs rounded-full bg-white text-lg`,
  subIcon: tw`p-xxs rounded-full text-gray-500 text-base bg-white`,
  panel: tw`py-1 px-2 border-2 uppercase tracking-wide text-xs rounded-sm font-medium hover:bg-gray-100 bg-gray-50 transition-colors ease-in-out duration-75`,
  deleteIconOnHover: tw`hover:text-red-warning hover:scale-125`,
};

export default s_button;
