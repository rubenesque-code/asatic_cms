import { User, Wrench } from "phosphor-react";
import tw from "twin.macro";

const UserCreatedIcon = () => (
  <div css={[tw`relative inline-block`]}>
    <span>
      <User />
    </span>
    <span css={[tw`absolute bottom-0 -right-1.5 text-xs text-gray-800`]}>
      <Wrench />
    </span>
  </div>
);

export default UserCreatedIcon;
