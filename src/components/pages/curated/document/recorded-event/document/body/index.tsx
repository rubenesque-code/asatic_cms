import { $Body } from "../_styles";
import Description from "./description";
import VideoSection from "./video-section";

const Body = () => (
  <$Body>
    <VideoSection />
    <Description />
  </$Body>
);

export default Body;
