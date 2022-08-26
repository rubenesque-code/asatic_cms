import { ReactElement } from "react";
import tw from "twin.macro";

export default function ArticleUI({ children }: { children: ReactElement }) {
  return (
    <article css={[tw`h-full flex flex-col font-serif-eng`]}>
      {children}
    </article>
  );
}

ArticleUI.Header = tw.div`flex flex-col items-start gap-sm pt-lg pb-md border-b`;

ArticleUI.Title = tw.div`text-3xl font-medium`;

ArticleUI.Authors = tw.div`text-xl`;

ArticleUI.Body = tw.div`flex flex-col flex-grow`;

// Arti
