import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { ROUTES, ExtractRouteKey, Routes } from "^constants/routes";
import { RootState } from "^redux/store";

type DisplayEntityRouteKey = ExtractRouteKey<
  "ARTICLES" | "BLOGS" | "COLLECTIONS" | "RECORDEDEVENTS"
>;
type DisplayEntityRoute = Routes[DisplayEntityRouteKey]["route"];

type DisplayEntityStoreField = Extract<
  keyof RootState,
  "articles" | "blogs" | "collections" | "recordedEvents"
>;

const docMappings: {
  [key: string]: {
    redirectRoute: DisplayEntityRoute;
    stateField: DisplayEntityStoreField;
  };
} = {
  article: {
    redirectRoute: ROUTES.ARTICLES.route,
    stateField: "articles",
  },
  blog: {
    redirectRoute: ROUTES.BLOGS.route,
    stateField: "blogs",
  },
  collection: {
    redirectRoute: ROUTES.COLLECTIONS.route,
    stateField: "collections",
  },
  recordedEvent: {
    redirectRoute: ROUTES.RECORDEDEVENTS.route,
    stateField: "recordedEvents",
  },
};

const HandleRouteValidity = ({
  children,
  docType,
}: {
  children: ReactElement;
  docType: DisplayEntityStoreField;
}) => {
  const docId = useGetSubRouteId();
  const doc = useSelector((state) => {
    const entities = state[docType];
    const entity = entities.entities[docId];

    return entity;
  });

  const router = useRouter();

  useEffect(() => {
    if (doc) {
      return;
    }
    setTimeout(() => {
      router.push(docMappings[docType].redirectRoute);
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
