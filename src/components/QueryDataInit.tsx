import { ReactElement } from "react";
import Spinner from "./Spinner";

const QueryDataInit = ({
  queryData,
  children,
}: {
  queryData: (Record<string, unknown> & {
    isError: boolean;
    isLoading: boolean;
  })[];
  children: ReactElement;
}) => {
  const isError = queryData.find((data) => data.isError);
  const isLoading = queryData.find((data) => data.isLoading);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <Error />;
  }

  return children;
};

const Loading = () => (
  <div className="grid place-items-center w-full h-screen">
    <div className="flex flex-col items-center">
      <Spinner />
      <p className="mt-6">Loading data...</p>
    </div>
  </div>
);

const Error = () => (
  <div className="grid place-items-center w-full h-screen">
    <p>Couldn&apos;t load data. Please refresh the page to try again.</p>
  </div>
);

export default QueryDataInit;
