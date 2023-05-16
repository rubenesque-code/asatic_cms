import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { createLanguage } from "^data/createDocument";

import { fetchLanguages } from "^lib/firebase/firestore/fetch";
import { writeLanguage } from "^lib/firebase/firestore/write/writeDocs";
import { Language } from "^types/language";

export const languagesApi = createApi({
  reducerPath: "languagesApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    fetchLanguages: build.query<Language[], void>({
      queryFn: async () => {
        try {
          const resData = (await fetchLanguages()) as Language[] | undefined;
          const data = resData || [];

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    createLanguage: build.mutation<
      { language: Language },
      Parameters<typeof createLanguage>[0]
    >({
      queryFn: async (createLanguageArg) => {
        try {
          const newLanguage = createLanguage(createLanguageArg);
          await writeLanguage(newLanguage);

          return {
            data: { language: newLanguage },
          };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useFetchLanguagesQuery, useCreateLanguageMutation } =
  languagesApi;
