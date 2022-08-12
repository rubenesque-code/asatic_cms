export type Mutation = readonly [
  writeToDb: () => void,
  data: { isError: boolean; isLoading: boolean; isSuccess: boolean } & Record<
    string,
    unknown
  >
];
