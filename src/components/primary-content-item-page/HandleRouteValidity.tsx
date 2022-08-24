import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { ROUTES, RouteValue } from "^constants/routes";
import { RootState } from "^redux/store";

type StateDataField = Extract<
  keyof RootState,
  "blogs" | "collections" | "recordedEvents"
>;

const docMappings: {
  [key: string]: {
    redirectRoute: RouteValue;
    stateField: StateDataField;
  };
} = {
  /*   article: {
    selector: selectArticleById,
    redirectRoute: ROUTES.ARTICLES,
  }, */
  blog: {
    redirectRoute: ROUTES.BLOGS,
    stateField: "blogs",
  },
  collection: {
    redirectRoute: ROUTES.COLLECTIONS,
    stateField: "collections",
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
  const doc = useSelector((state) => {
    const field = docMappings[docType].stateField;
    const entities = state[field];
    const entity = entities.entities[docId];

    return entity;
  });

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
