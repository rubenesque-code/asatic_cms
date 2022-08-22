import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
// import { selectById as selectArticleById } from "^redux/state/articles";
// import { selectById as selectRecordedEventById } from "^redux/state/recordedEvents";
import { selectById as selectBlogById } from "^redux/state/blogs";
import { selectById as selectCollectionById } from "^redux/state/collections";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { ROUTES } from "^constants/routes";

const docMappings = {
  /*   article: {
    selector: selectArticleById,
    redirectRoute: ROUTES.ARTICLES,
  }, */
  blog: {
    selector: selectBlogById,
    redirectRoute: ROUTES.BLOGS,
  },
  collection: {
    selector: selectCollectionById,
    redirectRoute: ROUTES.COLLECTIONS,
  },
  /*   recordedEvent: {
    selector: selectRecordedEventById,
    redirectRoute: ROUTES.RECORDEDEVENTS,
  }, */
};

const HandleRouteValidity = ({
  children,
  docType,
}: {
  children: ReactElement;
  docType: keyof typeof docMappings;
}) => {
  const docId = useGetSubRouteId();
  const doc = useSelector((state) =>
    docMappings[docType].selector(state, docId)
  );

  const router = useRouter();

  useEffect(() => {
    if (doc) {
      return;
    }
    setTimeout(() => {
      router.push("/" + docMappings[docType].redirectRoute);
    }, 850);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  if (doc) {
    return children;
  }

  return (
    <div css={[tw`w-screen h-screen grid place-items-center`]}>
      <p>Couldn&apos;t find {docType}. Redirecting...</p>
    </div>
  );
};

export default HandleRouteValidity;
