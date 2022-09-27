import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { checkIsAdmin, sendSignInLink } from "^lib/firebase/authentication";

export const authenticationApi = createApi({
  reducerPath: "authenticationApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (build) => ({
    checkIsAdmin: build.query<boolean, string>({
      queryFn: async (email) => {
        try {
          const isAdmin = await checkIsAdmin(email);
          console.log("isAdmin:", isAdmin);

          return { data: isAdmin };
        } catch (error) {
          return { error: true };
        }
      },
    }),
    sendSignInLink: build.query<null, string>({
      queryFn: async (email) => {
        try {
          sendSignInLink(email);

          return { data: null };
        } catch (error) {
          return { error: true };
        }
      },
    }),
  }),
});

export const { useLazyCheckIsAdminQuery, useLazySendSignInLinkQuery } =
  authenticationApi;
