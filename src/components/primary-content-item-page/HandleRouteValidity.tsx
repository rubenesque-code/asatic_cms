import { ReactElement, useEffect } from "react";
import { useRouter } from "next/router";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { ROUTES } from "^constants/routes";
// import { RootState } from "^redux/store";

/* type DisplayEntityRouteKey = ExtractRouteKey<
  "ARTICLES" | "BLOGS" | "COLLECTIONS" | "RECORDEDEVENTS"
>; */
/* type DisplayEntityRoute = Routes[DisplayEntityRouteKey]["route"];

type DisplayEntityStoreField = Extract<
  keyof RootState,
  "articles" | "blogs" | "collections" | "recordedEvents"
>; */

const entityMappings = {
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
} as const;

const HandleRouteValidity = ({
  children,
  entityType,
}: {
  children: ReactElement;
  entityType: keyof typeof entityMappings;
}) => {
  const entityId = useGetSubRouteId();
  const entity = useSelector((state) => {
    const entityStateField = entityMappings[entityType].stateField;
    const entities = state[entityStateField];
    const entity = entities.entities[entityId];

    return entity;
  });

  const router = useRouter();

  useEffect(() => {
    if (entity) {
      return;
    }
    setTimeout(() => {
      router.push(entityMappings[entityType].redirectRoute);
    }, 850);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  if (entity) {
    return children;
  }

  return (
    <div css={[tw`w-screen h-screen grid place-items-center`]}>
      <p>Couldn&apos;t find {entityType}. Redirecting...</p>
    </div>
  );
};

export default HandleRouteValidity;
