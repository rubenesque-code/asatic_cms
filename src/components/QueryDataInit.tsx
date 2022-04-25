import { ReactElement } from "react";
import tw from "twin.macro";
import Spinner from "./Spinner";

/** returns widget or unchanged children */
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
  <div css={[s.fullScreenContainer]}>
    <div css={[s.widgetContainer]}>
      <Spinner />
      <p>Loading data...</p>
    </div>
  </div>
);

const Error = () => (
  <div css={[s.fullScreenContainer]}>
    <p>Couldn&apos;t load data. Please refresh the page to try again.</p>
  </div>
);

export default QueryDataInit;

const s = {
  fullScreenContainer: tw`grid place-items-center w-full h-screen`,
  widgetContainer: tw`flex flex-col items-center gap-sm`,
};
