export const wait = (time: number) =>
  new Promise(resolve => setTimeout(() => resolve(), time))
export const nextTick = () =>
  new Promise(resolve => process.nextTick(() => resolve()))
