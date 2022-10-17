import { ArrowsClockwise, CloudArrowUp, Prohibit } from "phosphor-react";
import tw from "twin.macro";

import { formatDateTimeAgo } from "^helpers/general";

import {
  useCancelDeployMutation,
  useCreateDeployMutation,
  useFetchLatestDeployQuery,
  useLazyFetchLatestDeployQuery,
  DeployStatus,
  Deploy,
} from "^redux/services/deploy";

import {
  $PanelContainer,
  $Heading,
  $description,
} from "^components/rich-popover/_styles";
import ContentMenu from "^components/menus/Content";

const Panel = () => {
  const {
    data: latestDeployData,
    isFetching: isFetchingLatestDeploy,
    isSuccess: fetchLatestDeployIsSuccess,
  } = useFetchLatestDeployQuery();
  const [
    createDeploy,
    { isError: isCreateDeployError, isLoading: isLoadingCreateDeploy },
  ] = useCreateDeployMutation();
  const [cancelDeploy, { isError: isCancelError, isLoading: isLoadingCancel }] =
    useCancelDeployMutation();

  const isDeploying =
    latestDeployData?.readyState === "INITIALIZING" ||
    latestDeployData?.readyState === "QUEUED" ||
    latestDeployData?.readyState === "PENDING" ||
    latestDeployData?.readyState === "BUILDING";

  return (
    <$PanelContainer css={[tw`w-[700px]`]}>
      <Description />
      <LatestDeployData
        isFetchSuccess={fetchLatestDeployIsSuccess}
        isFetching={isFetchingLatestDeploy}
        latestDeployData={latestDeployData}
        showUpdateButton={
          isLoadingCancel || isLoadingCreateDeploy ? false : true
        }
      />
      <div css={[tw`mt-lg`]}>
        {!isDeploying ? (
          <>
            {isLoadingCreateDeploy ? (
              <$RequestText>Sending deploy request...</$RequestText>
            ) : (
              <div>
                <CreateDeployButton createDeploy={createDeploy} />
                {isCreateDeployError ? (
                  <$RequestText>Error creating deploy.</$RequestText>
                ) : null}
              </div>
            )}
          </>
        ) : (
          <>
            {isLoadingCancel ? (
              <$RequestText>Sending cancel request...</$RequestText>
            ) : (
              <CancelDeployButton
                cancelDeploy={() => cancelDeploy(latestDeployData!.id)}
              />
            )}
            {isCancelError ? (
              <$RequestText>Error cancelling deploy.</$RequestText>
            ) : null}
          </>
        )}
      </div>
    </$PanelContainer>
  );
};

export default Panel;

const Description = () => (
  <>
    <$Heading>Deploy</$Heading>
    <div css={[$description, tw`mt-sm`]}>
      <p>Deploying updates the website with newly saved content.</p>
      <ul css={[tw`mt-xxxs list-disc ml-md`]}>
        <li>
          Deploying after each save is not necessary. Deploy at the end of each
          session.
        </li>
        <li>
          Deploying is site-wide. It is not necessary to deploy for each type of
          content.
        </li>
        <li>Each deploy should take 2 - 5 minutes but may take longer.</li>
      </ul>
    </div>
  </>
);

const $RequestText = tw.p`font-mono text-gray-600 text-sm`;

const LatestDeployData = ({
  isFetching,
  isFetchSuccess,
  latestDeployData,
  showUpdateButton,
}: {
  isFetching: boolean;
  isFetchSuccess: boolean;
  latestDeployData: Deploy | undefined;
  showUpdateButton: boolean;
}) => {
  return (
    <>
      <p css={[tw`text-sm mt-md`]}>Latest deploy data:</p>
      <div css={[tw`mt-sm`]}>
        {isFetching ? (
          <$RequestText>Fetching data...</$RequestText>
        ) : (
          <>
            <div css={[tw`flex items-center gap-md`]}>
              {isFetchSuccess ? (
                <p>
                  <ReadyState readyState={latestDeployData!.readyState} />,{" "}
                  <span css={[tw`text-sm text-gray-600`]}>
                    {formatDateTimeAgo(latestDeployData!.createdAt)}
                  </span>
                </p>
              ) : (
                <p>There was an error fetching deploy data</p>
              )}
              {showUpdateButton ? <UpdateDataButton /> : null}
            </div>
            <>
              {showUpdateButton ? (
                <p
                  css={[
                    tw`mt-xxxs text-sm text-gray-400 italic flex items-center gap-xxs`,
                  ]}
                >
                  (Does not update automatically. Click{" "}
                  <span>
                    <ArrowsClockwise />
                  </span>{" "}
                  button to update.)
                </p>
              ) : null}
            </>
          </>
        )}
      </div>
    </>
  );
};

const ReadyState = ({ readyState }: { readyState: DeployStatus }) => {
  return (
    <span
      css={[
        tw`text-sm uppercase`,
        readyState === "ERROR"
          ? tw`text-red-warning`
          : readyState === "READY"
          ? tw`text-green-active`
          : tw`text-gray-600`,
      ]}
    >
      {readyState === "CANCELED" ? "CANCELLED" : readyState}
    </span>
  );
};

const UpdateDataButton = () => {
  const [fetchLatestDeploy] = useLazyFetchLatestDeployQuery();

  return (
    <ContentMenu.Button
      onClick={fetchLatestDeploy}
      tooltipProps={{ text: "update deploy data", type: "action" }}
    >
      <span css={[tw`text-sm`]}>
        <ArrowsClockwise />
      </span>
    </ContentMenu.Button>
  );
};

const CreateDeployButton = ({ createDeploy }: { createDeploy: () => void }) => {
  return (
    <button
      css={[tw`flex items-center gap-xs py-1 px-3 rounded-sm bg-purple-300`]}
      onClick={() => createDeploy()}
      type="button"
    >
      <span css={[tw`text-white`]}>
        <CloudArrowUp weight="bold" />
      </span>
      <span css={[tw`uppercase text-sm tracking-wide text-purple-800`]}>
        update site
      </span>
    </button>
  );
};

const CancelDeployButton = ({ cancelDeploy }: { cancelDeploy: () => void }) => {
  return (
    <button
      css={[tw`flex items-center gap-xs border py-1 px-3 rounded-sm`]}
      onClick={cancelDeploy}
      type="button"
    >
      <span css={[tw`text-red-warning`]}>
        <Prohibit />
      </span>
      <span css={[tw`uppercase text-sm`]}>cancel deploy</span>
    </button>
  );
};
