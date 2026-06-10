/** 微信真机/4G 下同域名并发约 10；真机调试隧道下更保守 */
const MAX_CONCURRENT = 3;

let active = 0;
const pending: Array<() => void> = [];

export function runWithRequestSlot<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const run = () => {
      active += 1;
      fn()
        .then(resolve, reject)
        .finally(() => {
          active -= 1;
          const next = pending.shift();
          if (next) next();
        });
    };

    if (active < MAX_CONCURRENT) run();
    else pending.push(run);
  });
}
