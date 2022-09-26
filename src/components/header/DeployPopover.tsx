import { ArrowsClockwise, CloudArrowUp, Prohibit } from "phosphor-react";
import tw from "twin.macro";

import { formatDateTimeAgo } from "^helpers/general";

import ProximityPopover from "^components/ProximityPopover";
import {
  useCancelDeployMutation,
  useCreateDeployMutation,
  useFetchLatestDeployQuery,
  useLazyFetchLatestDeployQuery,
} from "^redux/services/deploy";

import Header from "./Header";

const DeployPopover = () => {
  return (
    <ProximityPopover>
      {({ isOpen }) => (
        <>
          <ProximityPopover.Button>
            <Button />
          </ProximityPopover.Button>
          <ProximityPopover.Panel isOpen={isOpen}>
            <Panel />
          </ProximityPopover.Panel>
        </>
      )}
    </ProximityPopover>
  );
};

export default DeployPopover;

const Button = () => {
  return (
    <Header.IconButton tooltip="deploy">
      <CloudArrowUp />
    </Header.IconButton>
  );
};

const Panel = () => {
  const {
    data: latestDeployData,
    isFetching: isFetchingLatestDeploy,
    isSuccess: fetchLatestDeployIsSuccess,
    // isUninitialized: latestIsUninitialized
  } = useFetchLatestDeployQuery();
  const [fetchLatestDeploy] = useLazyFetchLatestDeployQuery();
  const [
    createDeploy,
    {
      isError: isCreateDeployError,
      isLoading: isLoadingCreateDeploy,
      // isSuccess: isCreateDeploySuccess,
    },
  ] = useCreateDeployMutation();
  const [
    cancelDeploy,
    {
      isError: isCancelError,
      isLoading: isLoadingCancel,
      isSuccess: isCancelSuccess,
    },
  ] = useCancelDeployMutation();

  const isDeploying =
    latestDeployData?.readyState === "INITIALIZING" ||
    latestDeployData?.readyState === "QUEUED" ||
    latestDeployData?.readyState === "PENDING" ||
    latestDeployData?.readyState === "BUILDING";

  return (
    <div
      css={[
        tw`w-[800px] max-w-[94vw] p-md bg-white shadow-lg rounded-md border`,
      ]}
    >
      <h2 css={[tw`font-medium text-lg`]}>Deploys</h2>
      <div css={[tw`mt-xs text-gray-600 text-sm`]}>
        <p>Deploying updates the website with newly saved content.</p>
        <ul css={[tw`mt-xxxs list-disc ml-md`]}>
          <li>
            Deploying after each save is not necessary. Deploy at the end of
            each session.
          </li>
          <li>
            Deploying is site-wide. It is not necessary to deploy for each type
            of content.
          </li>
          <li>Each deploy should take 2 - 5 minutes but may take longer.</li>
        </ul>
      </div>
      <div css={[tw`text-sm mt-sm flex gap-xl`]}>
        <div>
          {isFetchingLatestDeploy ? (
            <p>Loading deploy data...</p>
          ) : fetchLatestDeployIsSuccess ? (
            <div>
              <h4 css={[tw`font-medium`]}>Latest deploy data</h4>
              <p css={[tw`mt-xs`]}>status: {latestDeployData.readyState}</p>
              <p>started: {formatDateTimeAgo(latestDeployData.createdAt)}</p>
            </div>
          ) : (
            <p>There was an error fetching deploy data</p>
          )}
        </div>
        <div css={[tw`grid place-items-center`]}>
          <button
            css={[tw`flex items-center gap-xs border py-1 px-3 rounded-sm`]}
            onClick={() => fetchLatestDeploy()}
            type="button"
          >
            <span css={[tw`text-sm`]}>Update deploy data</span>
            <span>
              <ArrowsClockwise />
            </span>
          </button>
        </div>
      </div>
      {!isDeploying ? (
        <div css={[tw`text-sm mt-md`]}>
          {isLoadingCreateDeploy ? (
            <p>Sending deploy request...</p>
          ) : (
            <div>
              <button
                css={[tw`flex items-center gap-xs border py-1 px-3 rounded-sm`]}
                onClick={() => createDeploy()}
                type="button"
              >
                <span>
                  <CloudArrowUp />
                </span>
                <span css={[tw`uppercase text-sm`]}>create deploy</span>
              </button>
              {isCreateDeployError ? <p>Error creating deploy</p> : null}
              {/* {isCreateDeploySuccess ? <p>Deploy created</p> : null} */}
            </div>
          )}
        </div>
      ) : null}
      {isDeploying ? (
        <div css={[tw`text-sm mt-md`]}>
          {isLoadingCancel ? (
            <p>Sending cancel request...</p>
          ) : (
            <button
              css={[tw`flex items-center gap-xs border py-1 px-3 rounded-sm`]}
              onClick={() => cancelDeploy(latestDeployData.id)}
              type="button"
            >
              <span css={[tw`text-red-warning`]}>
                <Prohibit />
              </span>
              <span css={[tw`uppercase text-sm`]}>cancel deploy</span>
            </button>
          )}
          {isCancelError ? <p>Error canceling deploy.</p> : null}
          {isCancelSuccess ? <p>Deploy cancelled.</p> : null}
        </div>
      ) : null}
    </div>
  );
};
