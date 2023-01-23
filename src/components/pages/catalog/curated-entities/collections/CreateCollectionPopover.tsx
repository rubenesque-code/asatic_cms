import { useState } from "react";
import tw from "twin.macro";
import { FilePlus } from "phosphor-react";

import { useCreateCollectionMutation } from "^redux/services/collections";

import Popover from "^components/ProximityPopover";
import { $PanelContainer } from "^components/rich-popover/_styles";
import { $Heading } from "^components/rich-popover/_styles";
import {
  SiteLanguageSelect,
  SiteLanguageSelectProvider,
  useSiteLanguageSelectContext,
} from "../../_containers/site-language-select";

const CreateCollectionPopover = () => {
  return (
    <Popover>
      <Popover.Panel>
        {({ close }) => (
          <SiteLanguageSelectProvider>
            <Panel closePanel={close} />
          </SiteLanguageSelectProvider>
        )}
      </Popover.Panel>
      <Popover.Button>
        <Button />
      </Popover.Button>
    </Popover>
  );
};

export default CreateCollectionPopover;

const Button = () => {
  return (
    <button
      css={[
        tw`flex items-center gap-8 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 duration-75 active:translate-y-0.5 active:translate-x-0.5 transition-all ease-in-out text-white rounded-md py-2 px-4`,
      ]}
      type="button"
    >
      <span css={[tw`font-medium uppercase text-sm`]}>Create collection</span>
      <span>
        <FilePlus />
      </span>
    </button>
  );
};

const Panel = ({ closePanel }: { closePanel: () => void }) => {
  const [titleInputValue, setTitleInputValue] = useState("");

  const { selectedLanguageId } = useSiteLanguageSelectContext();

  const [createCollection] = useCreateCollectionMutation();

  const handleSubmit = async () => {
    const isValid = titleInputValue.length;

    if (!isValid) {
      return;
    }

    createCollection({
      languageId: selectedLanguageId,
      title: titleInputValue,
      useToasts: true,
    });

    closePanel();
    setTitleInputValue("");
  };

  return (
    <$PanelContainer css={[tw`w-[500px]`]}>
      <$Heading>Create collection</$Heading>
      <div css={[tw`mt-md`]}>
        <SiteLanguageSelect />
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <$TitleInput_ setValue={setTitleInputValue} value={titleInputValue} />
      </form>
    </$PanelContainer>
  );
};

const titleInputId = "title-input-id";

export const $TitleInput_ = ({
  setValue,
  value,
}: {
  value: string;
  setValue: (value: string) => void;
}) => {
  return (
    <div css={[tw`flex items-center gap-sm mt-sm`]}>
      <label css={[tw`text-gray-600`]} htmlFor={titleInputId}>
        Title:
      </label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id={titleInputId}
        placeholder="title..."
        css={[tw`py-0.5 w-full rounded-md outline-none focus:outline-none`]}
        type="text"
      />
    </div>
  );
};
