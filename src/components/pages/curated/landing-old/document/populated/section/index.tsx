import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/landing";

import LandingSectionSlice from "^context/landing/LandingSectionContext";

import AutoSection from "./auto-section";
import UserSection from "./user-section";

export default function Section({ id }: { id: string }) {
  const section = useSelector((state) => selectById(state, id))!;

  return (
    <LandingSectionSlice.Provider section={section}>
      {section.type === "auto" ? <AutoSection /> : <UserSection />}
    </LandingSectionSlice.Provider>
  );
}
