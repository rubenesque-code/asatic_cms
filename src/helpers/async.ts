export const wait = function (ms = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const poll = async function (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: () => any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fnCondition: (arg0: any) => boolean,
  ms: number
) {
  let result = await fn();
  while (fnCondition(result)) {
    await wait(ms);
    result = await fn();
  }
  return result;
};
