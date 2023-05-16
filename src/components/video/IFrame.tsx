const VideoIFrame = ({
  height,
  src,
  width,
}: {
  width: number;
  height: number;
  src: string;
}) => {
  return (
    <iframe
      width={width}
      height={height}
      src={src}
      frameBorder="0"
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default VideoIFrame;
