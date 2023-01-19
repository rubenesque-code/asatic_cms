import { ReactElement } from "react";
import { CaretDown, PlusCircle } from "phosphor-react";
import tw from "twin.macro";

import SubjectSlice from "^context/subjects/SubjectContext";

import { ArticleIcon } from "^components/Icons";
import { DisplayEntityPopover_ } from "^components/rich-popover/display-entity";

const Empty = () => {
  const [
    {
      id: subjectId,
      articlesIds,
      blogsIds,
      collectionsIds,
      recordedEventsIds,
      languageId,
    },
    { addRelatedEntity },
  ] = SubjectSlice.useContext();

  return (
    <$Empty
      addEntityPopover={(button) => (
        <DisplayEntityPopover_
          parentEntity={{
            actions: {
              addDisplayEntity: (relatedEntity) =>
                addRelatedEntity({ relatedEntity }),
            },
            data: {
              existingEntities: {
                articlesIds,
                blogsIds,
                collectionsIds,
                recordedEventsIds,
              },
              id: subjectId,
              name: "subject",
              languageId,
            },
          }}
        >
          {button}
        </DisplayEntityPopover_>
      )}
    />
  );
};

export default Empty;

const $Empty = ({
  addEntityPopover,
}: {
  addEntityPopover: (button: ReactElement) => ReactElement;
}) => {
  return (
    <div css={[tw`min-h-[300px] pl-lg pt-lg`]}>
      <div css={[tw`mt-md font-sans`]}>
        <div css={[tw` relative text-gray-300 inline-flex items-center`]}>
          <span css={[tw`text-3xl`]}>
            <ArticleIcon weight="thin" />
          </span>
          <span css={[tw`absolute bottom-0 -right-1 bg-white`]}>
            <PlusCircle />
          </span>
        </div>
        <div css={[tw`flex items-center gap-xxs mt-xs`]}>
          <p css={[tw`text-gray-600`]}>Get started with the subject</p>
          {addEntityPopover(<Button />)}
        </div>
      </div>
    </div>
  );
};

function Button() {
  return (
    <button
      css={[tw`inline-flex items-center gap-xxs rounded-md py-1.5 px-3`]}
      className="group"
      type="button"
    >
      <span css={[tw`font-medium capitalize text-gray-600`]}>Add document</span>
      <span
        css={[
          tw`p-xxxs group-hover:bg-gray-50 group-active:bg-gray-100 rounded-full transition-colors duration-75 ease-in-out text-gray-500 text-xs`,
        ]}
      >
        <CaretDown />
      </span>
    </button>
  );
}
