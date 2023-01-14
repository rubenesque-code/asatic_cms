import {
  $MediaSectionContainer_,
  $MediaSectionEmpty_,
} from "^document-pages/_presentation/article-like";
import Menu from "./Menu";

const Empty = () => {
  return (
    <$MediaSectionContainer_
      menu={(containerIsHovered) => (
        <Menu isShowing={containerIsHovered} isImage={false} />
      )}
    >
      <$MediaSectionEmpty_ mediaType="image" />
    </$MediaSectionContainer_>
  );
};

export default Empty;
