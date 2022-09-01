// import { ReactElement } from "react";
import tw from "twin.macro";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function UI() {}

UI.Panel = tw.div`p-md bg-white shadow-lg rounded-md border`;

UI.DescriptionContainer = tw.div`w-[90%] max-w-[1200px]`;
UI.Title = tw.h4`font-medium text-lg`;
UI.Description = tw.p`text-gray-600 mt-xs text-sm`;
