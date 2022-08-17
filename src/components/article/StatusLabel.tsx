import { Info } from "phosphor-react";
import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";

import { formatDateTimeAgo } from "^helpers/general";

import useArticleStatus from "^hooks/useArticleStatus";

import { useArticleContext } from "^context/articles/ArticleContext";

import WithTooltip from "^components/WithTooltip";

const ArticleStatusLabel = ({
  includeNewType,
  showPublished = true,
}: {
  includeNewType?: boolean;
  showPublished?: boolean;
}) => {
  const [article] = useArticleContext();

  const status = useArticleStatus(article);

  const { date: publishDate } = article.publishInfo;
  const publishDateFormatted = publishDate
    ? formatDateTimeAgo(publishDate)
    : null;

  return includeNewType && status === "new" ? (
    <StatusUI colorStyles={tw`bg-blue-200 text-blue-500`}>new</StatusUI>
  ) : (!includeNewType && status === "new") || status === "draft" ? (
    <StatusUI colorStyles={tw`bg-gray-200 text-gray-500`}>
      <>
        draft
        <span css={[tw`text-gray-500`]}>
          <WithTooltip
            text={{
              header: "Draft document",
              body: "Draft documents won't be shown on the site.",
            }}
          >
            <Info />
          </WithTooltip>
        </span>{" "}
      </>
    </StatusUI>
  ) : status === "invalid" ? (
    <StatusUI colorStyles={tw`bg-red-200 text-red-500`}>
      <>
        invalid
        <span css={[tw`text-gray-500`]}>
          <WithTooltip
            text={{
              header: "Invalid Document",
              body: `This document is published but has no valid translation (with title and text). It won't be shown on the website.`,
            }}
          >
            <Info />
          </WithTooltip>
        </span>
      </>
    </StatusUI>
  ) : typeof status === "object" ? (
    <StatusUI colorStyles={tw`bg-orange-200 text-orange-500`}>
      <>
        errors
        <span css={[tw`text-gray-500`]}>
          <WithTooltip
            text={{
              header: "Article errors",
              body: `This article is published but has errors. It's still valid and will be shown on the website. Errors: ${status.join(
                ", "
              )}`,
            }}
          >
            <Info />
          </WithTooltip>
        </span>
      </>
    </StatusUI>
  ) : showPublished ? (
    <StatusUI colorStyles={tw`bg-green-200 text-green-500`}>
      {`Published ${publishDateFormatted}`}
    </StatusUI>
  ) : null;
};

export default ArticleStatusLabel;

const StatusUI = ({
  children,
  colorStyles,
}: {
  children: string | ReactElement | ReactElement[];
  colorStyles: TwStyle;
}) => (
  <span
    css={[
      tw`text-center rounded-lg py-0.5 px-2 font-sans flex items-center gap-xs`,
      colorStyles,
    ]}
  >
    {children}
  </span>
);
