import HeaderGeneric from "^components/header/HeaderGeneric2";
import { useCollectionContext } from "^context/collections/CollectionContext";

// publish
// translations

// subjects
// tags
// settings
// save, undo

const Header = () => {
  return (
    <HeaderGeneric
      leftElements={}
      rightElements={}
      confirmBeforeLeavePage={false}
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishInfo }, { to }] = useCollectionContext();

  return;
};
