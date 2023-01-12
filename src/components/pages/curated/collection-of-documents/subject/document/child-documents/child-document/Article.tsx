import { $ArticleLikeSummaryLayout_ } from "^curated-pages/collection-of-documents/_presentation";
import {
  Authors,
  Image,
  Menu,
  Status,
  Text,
  Title,
} from "^curated-pages/collection-of-documents/_components/ArticleSummary";

const Article = () => {
  return (
    <$ArticleLikeSummaryLayout_
      authors={<Authors />}
      image={}
      menu={}
      status={<Status />}
      text={}
      title={<Title />}
    />
  );
};

export default Article;
