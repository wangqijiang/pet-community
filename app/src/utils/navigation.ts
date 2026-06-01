let relaunchPending = false;

/** 避免启动阶段重复 reLaunch 导致 timeout */
export function safeReLaunch(url: string, delay = 80) {
  const target = url.replace(/^\//, "").split("?")[0];
  const pages = getCurrentPages();
  const current = pages[pages.length - 1] as { route?: string } | undefined;
  if (current?.route === target || relaunchPending) return;

  relaunchPending = true;
  setTimeout(() => {
    uni.reLaunch({
      url,
      complete: () => {
        relaunchPending = false;
      },
    });
  }, delay);
}
