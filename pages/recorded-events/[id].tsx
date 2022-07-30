import { NextPage } from "next";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import HandleRouteValidity from "^components/HandleRouteValidity";
import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";

const RecordedEventPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.RECORDEDEVENTS,
          Collection.AUTHORS,
          Collection.LANGUAGES,
          Collection.SUBJECTS,
          Collection.TAGS,
        ]}
      >
        <HandleRouteValidity docType="recordedEvent">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default RecordedEventPage;

const PageContent = () => {
  return <div>Recorded Event Page</div>;
};
