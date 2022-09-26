import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { wait } from "^helpers/general";
import { cancelDeploy, createDeploy, fetchLatestDeploy } from "^lib/vercel";

const FETCHTAG = "fetch-deploy";

type DeployStatus =
  | "INITIALIZING"
  | "BUILDING"
  | "READY"
  | "ERROR"
  | "QUEUED"
  | "CANCELED"
  | "PENDING";

type Deploy = { id: string; readyState: DeployStatus; createdAt: Date };

export const deployApi = createApi({
  reducerPath: "deployApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: [FETCHTAG],
  endpoints: (build) => ({
    fetchLatestDeploy: build.query<Deploy, void>({
      queryFn: async () => {
        try {
          const fullData = await fetchLatestDeploy();
          const data = {
            id: fullData.id,
            readyState: fullData.readyState,
            createdAt: fullData.createdAt,
          } as Deploy;

          return { data };
        } catch (error) {
          return { error: true };
        }
      },
      providesTags: [FETCHTAG],
    }),
    createDeploy: build.mutation<null, void>({
      queryFn: async () => {
        try {
          await createDeploy();
          await wait(3000);

          return {
            data: null,
          };
        } catch (error) {
          console.log("error:", error);
          return { error: true };
        }
      },
      invalidatesTags: [FETCHTAG],
    }),
    cancelDeploy: build.mutation<null, string>({
      queryFn: async (deployId) => {
        try {
          await cancelDeploy(deployId);
          await wait(3000);

          return {
            data: null,
          };
        } catch (error) {
          console.log("error:", error);
          return { error: true };
        }
      },
      invalidatesTags: [FETCHTAG],
    }),
  }),
});

export const {
  useFetchLatestDeployQuery,
  useLazyFetchLatestDeployQuery,
  useCreateDeployMutation,
  useCancelDeployMutation,
} = deployApi;
