import tw from "twin.macro";

export const $Container = tw.div`mt-sm`;

export const $AllTranslations = tw.div`flex gap-md flex-wrap`;

export const $Translations = tw.div`flex gap-sm items-center `;
// export const $Translations = tw.div`flex gap-sm items-center w-full max-w-[100%] overflow-x-auto overflow-y-hidden`;

export const $TranslationDivider = tw.div`w-[1px] h-[15px] bg-gray-200`;

export const $Translation = tw.div`flex flex-nowrap`;

export const $TranslationText = tw.div`text-gray-700 mr-xs whitespace-nowrap`;

export const $TranslationsInactive = tw.div`flex gap-sm items-baseline opacity-40`;
