import { ReactElement } from "react";
import tw from "twin.macro";

export default function PanelUI({ children }: { children: ReactElement }) {
  return (
    <div css={[tw`p-md bg-white shadow-lg rounded-md border`]}>{children}</div>
  );
}

PanelUI.DescriptionSkeleton = function DescriptionSkeleton({
  areSubDocs,
  description,
  docType,
  subDocType,
  title,
}: {
  title: string;
  description: string;
  docType: string;
  subDocType: string;
  areSubDocs: boolean;
}) {
  return (
    <div>
      <h4 css={[tw`font-medium text-lg`]}>{title}</h4>
      <p css={[tw`text-gray-600 mt-xs text-sm`]}>{description}</p>
      {!areSubDocs ? (
        <p css={[tw`text-gray-800 mt-sm text-sm`]}>
          This {docType} isn&apos;t related to a {subDocType} yet.
        </p>
      ) : (
        <p css={[tw`mt-md text-sm `]}>
          This {docType} is related to the following {subDocType}(s):
        </p>
      )}
    </div>
  );
};

// PanelUI.List = tw.div`flex flex-col gap-md`;
PanelUI.List = function List({
  children: listItems,
}: {
  children: ReactElement[];
}) {
  return (
    <div css={[tw`flex flex-col gap-md`]}>
      {listItems.map((listItem, i) => (
        <PanelUI.ListItem number={i + 1} key={i}>
          {listItem}
        </PanelUI.ListItem>
      ))}
    </div>
  );
};

PanelUI.ListItem = function ListItem({
  children,
  number,
}: {
  children: ReactElement;
  number: number;
}) {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
      {children}
    </div>
  );
};
