import tw, { css } from "twin.macro";

const test = () => {
  return (
    <>
      <button
        css={[buttonStyles, moreStyles]}
        onClick={() => console.log(typeof tw)}
      >
        Hello
      </button>
      <button
        css={[
          css`
            ${tw`border-2 border-red-600`}
          `,
        ]}
      >
        Hello again
      </button>
      <div css={[tw`border-2`]}>Hello</div>
    </>
  );
};

export default test;

const buttonStyles = css`
  ${tw`border-2 border-red-600`}
`;

const moreStyles = tw`bg-blue-300`;
