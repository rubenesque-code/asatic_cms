import {
  Article,
  Notepad,
  VideoCamera,
  CirclesFour,
  PenNib,
  Books,
  Tag,
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
} from "phosphor-react";
import tw, { TwStyle } from "twin.macro";

const PlayIcon = ({ styles }: { styles: TwStyle }) => {
  return (
    <div css={[tw`z-10 absolute text-4xl`, styles]}>
      <PlayCircle weight="fill" />
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
  Tag as TagIcon,
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
};
