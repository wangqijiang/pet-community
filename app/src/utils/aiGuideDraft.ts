export const AI_GUIDE_PUBLISH_DRAFT_KEY = "aiGuidePublishDraft";

export interface AiGuidePublishDraft {
  title: string;
  content: string;
}

export function saveAiGuidePublishDraft(draft: AiGuidePublishDraft) {
  uni.setStorageSync(AI_GUIDE_PUBLISH_DRAFT_KEY, draft);
}

export function consumeAiGuidePublishDraft(): AiGuidePublishDraft | null {
  const draft = uni.getStorageSync(AI_GUIDE_PUBLISH_DRAFT_KEY) as
    | AiGuidePublishDraft
    | "";
  if (!draft || typeof draft !== "object") return null;
  uni.removeStorageSync(AI_GUIDE_PUBLISH_DRAFT_KEY);
  return draft;
}

export function buildGuideShareText(
  title: string,
  sections: Array<{ title: string; content: string }>,
) {
  const body = sections
    .map((s) => `【${s.title}】\n${s.content}`)
    .join("\n\n");
  return `${title}\n\n${body}`;
}
