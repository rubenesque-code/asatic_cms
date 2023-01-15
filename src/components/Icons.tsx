import {
  Article,
  Notepad,
  VideoCamera,
  CirclesFour,
  PenNib,
  Books,
  TagSimple,
  FileText,
  Trash,
  FileX,
  Image,
  PlayCircle,
  SquaresFour,
  Robot,
  User,
  Question,
  ArrowSquareOut,
  FilePlus,
  Translate,
  CloudArrowUp,
  Gear,
  ArrowsInLineHorizontal,
  ArrowsOutLineHorizontal,
  ToggleLeft,
  ToggleRight,
  YoutubeLogo,
  ArrowUp,
  ArrowDown,
  ArrowBendLeftDown,
  ArrowBendRightUp,
  WarningCircle,
  FileVideo,
  MagicWand,
} from "phosphor-react";
import tw, { TwStyle } from "twin.macro";

const PlayIcon = ({ styles }: { styles: TwStyle }) => {
  return (
    <div css={[tw`z-10 absolute text-4xl`, styles]}>
      <PlayCircle weight="fill" color="rgba(123, 123, 123)" />
      <div
        css={[
          tw`absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full w-3/5 h-3/5 bg-white`,
        ]}
        style={{ zIndex: -1 }}
      />
    </div>
  );
};

export {
  Article as ArticleIcon,
  Notepad as BlogIcon,
  VideoCamera as RecordedEventIcon,
  CirclesFour as CollectionIcon,
  PenNib as AuthorIcon,
  Books as SubjectIcon,
  TagSimple as TagIcon,
  FileText as EditEntityIcon,
  Trash as DeleteEntityIcon,
  FileX as RemoveRelatedEntityIcon,
  FilePlus as AddRelatedEntityIcon,
  Image as ImageIcon,
  PlayIcon,
  SquaresFour as LandingIcon,
  Robot as LandingAutoSectionIcon,
  User as LandingUserSectionIcon,
  Question as MissingIcon,
  ArrowSquareOut as GoToPageIcon,
  Translate as TranslateIcon,
  CloudArrowUp as DeployIcon,
  Gear as SettingsIcon,
  ArrowsInLineHorizontal as NarrowIcon,
  ArrowsOutLineHorizontal as WidenIcon,
  ToggleLeft as TurnOnIcon,
  ToggleRight as TurnOffIcon,
  YoutubeLogo as YoutubeVideoIcon,
  ArrowDown as MoveDownIcon,
  ArrowUp as MoveUpIcon,
  ArrowBendLeftDown as FocusImageLowerIcon,
  ArrowBendRightUp as FocusImageHigherIcon,
  WarningCircle as InvalidIcon,
  FileVideo as RecordedEventTypeIcon,
  MagicWand as AutomaticPopulateIcon,
};
