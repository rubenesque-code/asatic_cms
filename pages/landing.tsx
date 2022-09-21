import { NextPage } from "next";
import React from "react";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import PageContent from "^components/landing";

// todo: add content uses full tables of content

// todo: recorded-event type  + can think of any others? Have 'videos' and a new 'subjects' category that all content types can be added to.
// todo: index pages for articles and above new types
// todo: content search list of content; not ideal having just a search.
// todo: filter/indicate for draft state. same for content type with error. same for content type invalid (no valid translation)
// todo: link to go to edit content page for each component
// todo: should be able to edit all that can be seen? e.g. authors, title.

// todo: add a subjects + collections page

// todo: info somewhere about order of showing translations
// todo: choose font-serif. Also affects article font sizing
// todo: handle component borders
// todo: article validation + article publish status
// todo: handling authors properly? e.g. missing author translation

// todo: extend tiptap content type for image

// todo: image node type written twice on an article

// todo: asserting context value as {} leads to useContext check to not work

// todo: selectEntitiesByIds assertion in each state type is probably not safe and not good practice

// todo: NICE TO HAVES
// todo: select from article images on article image button
// todo: order auto-section components to show those not in custom sections.
// todo: make clear what each menu is controlling. e.g. on image menu hover, highlight image

const Landing: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.ARTICLES,
          Collection.AUTHORS,
          Collection.BLOGS,
          Collection.COLLECTIONS,
          Collection.IMAGES,
          Collection.LANDING,
          Collection.LANGUAGES,
          Collection.SUBJECTS,
          Collection.RECORDEDEVENTS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default Landing;
