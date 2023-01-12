/* eslint-disable jsx-a11y/alt-text */
import ArticleSlice from "^context/articles/ArticleContext";
import ArticleTranslationSlice from "^context/articles/ArticleTranslationContext";
import { MyOmit } from "^types/utilities";

import {
  ArticleLikeSummaryLayout_,
  Authors_,
  Image_,
  ArticleLikeMenu_,
  ArticleLikeMenu_Props,
  Status_,
  Text_,
  Title_,
} from "../_containers/summary";
import {
  useArticleSummaryImage,
  UseArticleSummaryImageArgs,
} from "../_hooks/useArticleSummaryImage";
import {
  useArticleSummaryText,
  UseArticleSummaryTextProps,
} from "../_hooks/useArticleSummaryText";

type ArticleSummaryProps = UseArticleSummaryImageArgs &
  MyOmit<MenuProps, "isShowing">;

const ArticleSummary = ({
  span,
  ignoreDeclaredSpan,
  removeComponent,
  updateComponentSpan,
}: ArticleSummaryProps) => {
  return (
    <ArticleLikeSummaryLayout_
      authors={<Authors />}
      image={<Image span={span} ignoreDeclaredSpan={ignoreDeclaredSpan} />}
      menu={(containerIsHovered) => (
        <Menu
          ignoreDeclaredSpan={ignoreDeclaredSpan}
          isShowing={containerIsHovered}
          span={span}
          removeComponent={removeComponent}
          updateComponentSpan={updateComponentSpan}
        />
      )}
      status={<Status />}
      text={<Text span={span} ignoreDeclaredSpan={ignoreDeclaredSpan} />}
      title={<Title />}
    />
  );
};

export default ArticleSummary;

const Authors = () => {
  const [{ authorsIds }] = ArticleSlice.useContext();
  const [{ languageId }] = ArticleTranslationSlice.useContext();

  return <Authors_ activeLanguageId={languageId} authorsIds={authorsIds} />;
};

const Image = (hookArgs: UseArticleSummaryImageArgs) => {
  const { hideImage, props } = useArticleSummaryImage(hookArgs);

  if (hideImage) {
    return null;
  }

  return <Image_ {...props} />;
};

type MenuProps = Pick<
  ArticleLikeMenu_Props,
  | "ignoreDeclaredSpan"
  | "isShowing"
  | "span"
  | "updateComponentSpan"
  | "removeComponent"
>;

const Menu = (passedProps: MenuProps) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    ArticleSlice.useContext();

  return (
    <ArticleLikeMenu_
      routeToEntityPage={routeToEditPage}
      toggleUseImageOn={toggleUseSummaryImage}
      usingImage={Boolean(summaryImage.useImage)}
      {...passedProps}
    />
  );
};

const Status = () => {
  const [{ status, publishDate }] = ArticleSlice.useContext();

  return <Status_ publishDate={publishDate} status={status} />;
};

type TextProps = UseArticleSummaryTextProps;

const Text = (props: TextProps) => {
  const textProps = useArticleSummaryText(props);

  return (
    <Text_
      maxCharacters={textProps.maxCharacters}
      text={textProps.text}
      updateSummary={textProps.updateText}
    />
  );
};

const Title = () => {
  const [{ title }] = ArticleTranslationSlice.useContext();

  return <Title_ title={title} />;
};
