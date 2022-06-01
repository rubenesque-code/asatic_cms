import {
  createContext,
  FormEvent,
  ReactElement,
  useContext,
  useState,
} from "react";
import tw from "twin.macro";

import WithProximityPopover from "^components/WithProximityPopover";

import s_input from "^styles/input";
import {
  checkIsYoutubeUrl,
  getYoutubeEmbedUrlFromYoutubeId,
  getYoutubeVideoIdFromUrl,
} from "^helpers/youtube";

type OnAddVideo = ({ id, URL }: { id: string; URL: string }) => void;

type ContextValue = {
  onAddVideo: OnAddVideo;
};

const Context = createContext<ContextValue>({} as ContextValue);
const { Provider } = Context;

const VideoContextProvider = ({
  children,
  onAddVideo,
}: {
  children: ReactElement;
  onAddVideo: OnAddVideo;
}) => {
  return <Provider value={{ onAddVideo }}>{children}</Provider>;
};

export const useVideoContext = () => {
  const context = useContext(Context);

  return context;
};

const WithAddYoutubeVideo = ({
  children,
  isDisabled = false,
  onAddVideo,
}: {
  children: ReactElement;
  isDisabled?: boolean;
  onAddVideo: OnAddVideo;
}) => {
  return (
    <VideoContextProvider onAddVideo={onAddVideo}>
      <WithProximityPopover
        isDisabled={isDisabled}
        panelContentElement={<NewVideoPanel />}
      >
        {children}
      </WithProximityPopover>
    </VideoContextProvider>
  );
};

export default WithAddYoutubeVideo;

/* const VideoTypeMenu = () => {
  return (
    <>
      <div css={[s_editorMenu.menu, tw`gap-sm`]}>
        <AddNewVideoPopover />
      </div>
    </>
  );
};

const AddNewVideoPopover = () => {
  return (
    <WithProximityPopover panelContentElement={<NewVideoPanel />}>
      <WithTooltip text="add new video">
        <button css={[s_editorMenu.button.button]} type="button">
          <Plus />
        </button>
      </WithTooltip>
    </WithProximityPopover>
  );
}; */

const NewVideoPanel = () => {
  const { onAddVideo } = useVideoContext();

  const [inputValue, setInputValue] = useState("");
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [wasJustSubmitted, setWasJustSubmitted] = useState(false);

  const valueIsYoutubeUrl = checkIsYoutubeUrl(inputValue);
  const showErrorMessage =
    inputValue.length && wasJustSubmitted && !valueIsYoutubeUrl;
  // const youtubeId = "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!valueIsYoutubeUrl) {
      setWasJustSubmitted(true);
      return;
    }

    const youtubeId = getYoutubeVideoIdFromUrl(inputValue);

    if (!youtubeId) {
      setIsSubmitError(true);
      setWasJustSubmitted(true);
      return;
    }

    const embedUrl = getYoutubeEmbedUrlFromYoutubeId(youtubeId);
    onAddVideo({ id: youtubeId, URL: embedUrl });
    setInputValue("");
  };

  return (
    <div
      css={[tw`p-sm bg-white rounded-lg border-2 border-black min-w-[35ch]`]}
    >
      <h4 css={[tw`text-base font-medium mb-sm`]}>Enter youtube url</h4>
      <form onSubmit={handleSubmit}>
        <input
          css={[
            s_input.input,
            s_input.focused,
            s_input.unFocused,
            s_input.transition,
          ]}
          value={inputValue}
          onChange={(e) => {
            setIsSubmitError(false);
            setWasJustSubmitted(false);
            setInputValue(e.target.value);
          }}
          placeholder=""
          type="text"
        />
        {showErrorMessage ? (
          <p css={[tw`text-red-warning mt-xs`]}>Invalid youtube url</p>
        ) : null}
        {isSubmitError ? (
          <p css={[tw`text-red-warning mt-xs`]}>
            Error submitting. Please try again.
          </p>
        ) : null}
      </form>
    </div>
  );
};
