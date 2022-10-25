import Summary from "./Summary";
import Status from "./Status";
import { $EntityContainer } from "../_styles";

const Blog = () => {
  return (
    <$EntityContainer>
      <Status />
      <Summary />
    </$EntityContainer>
  );
};

export default Blog;
