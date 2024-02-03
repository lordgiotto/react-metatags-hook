export const wait = (time: number) =>
  new Promise((resolve) => setTimeout(() => resolve(undefined), time));
export const nextTick = () =>
  new Promise((resolve) => process.nextTick(() => resolve(undefined)));
