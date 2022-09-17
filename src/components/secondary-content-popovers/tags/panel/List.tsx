import { FileMinus } from "phosphor-react";

import { useSelector } from "^redux/hooks";
import { selectTagById } from "^redux/state/tags";

import ListEntityUI from "../../ListEntityUI";
import PanelUI from "../../PanelUI";
import DocTagsPanel from ".";

import ContentMenu from "^components/menus/Content";
import TagSlice from "^context/tags/TagContext";

const subContentType = "tag";

const DocTagsList = () => {
  const { docTagsIds } = DocTagsPanel.useContext();

  return (
    <PanelUI.List>
      {docTagsIds.map((tagId, i) => (
        <PanelUI.ListItem number={i + 1} key={tagId}>
          <DocTag tagId={tagId} />
        </PanelUI.ListItem>
      ))}
    </PanelUI.List>
  );
};

export default DocTagsList;

const DocTag = ({ tagId: tagId }: { tagId: string }) => {
  const tag = useSelector((state) => selectTagById(state, tagId));

  return tag ? (
    <TagSlice.Provider tag={tag}>
      <Tag />
    </TagSlice.Provider>
  ) : (
    <MissingTag tagId={tagId} />
  );
};

const MissingTag = ({ tagId: tagId }: { tagId: string }) => {
  return (
    <ListEntityUI.Missing subContentType={subContentType}>
      <TagMenu tagId={tagId} />
    </ListEntityUI.Missing>
  );
};

const TagMenu = ({ tagId: tagId }: { tagId: string }) => {
  const { removeTagFromDoc: removeTagFromDoc } = DocTagsPanel.useContext();

  return (
    <ListEntityUI.Menu>
      <ContentMenu.ButtonWithWarning
        tooltipProps={{ text: `remove ${subContentType} from doc` }}
        warningProps={{
          callbackToConfirm: () => removeTagFromDoc(tagId),
          warningText: "Remove tag from doc?",
          type: "moderate",
        }}
      >
        <FileMinus />
      </ContentMenu.ButtonWithWarning>
    </ListEntityUI.Menu>
  );
};

const Tag = () => {
  const [{ id: tagId, text }] = TagSlice.useContext();

  return (
    <ListEntityUI menu={<TagMenu tagId={tagId} />}>
      <span>{text}</span>
    </ListEntityUI>
  );
};
