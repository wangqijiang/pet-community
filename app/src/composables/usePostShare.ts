import { ref } from "vue";
import { onShareAppMessage, onShareTimeline } from "@dcloudio/uni-app";
import {
  buildPostSharePath,
  buildPostShareQuery,
  buildPostShareTitle,
  type PostShareInput,
} from "@/utils/postShare";

export type PendingPostShare = {
  postId: number;
  title: string;
  path: string;
  query: string;
  imageUrl: string;
};

const pendingShare = ref<PendingPostShare | null>(null);

export function getPendingPostShare() {
  return pendingShare;
}

export function setPendingPostShare(payload: PendingPostShare | null) {
  pendingShare.value = payload;
}

export function buildPendingPostShare(
  input: PostShareInput,
  imageUrl: string,
): PendingPostShare {
  return {
    postId: input.id,
    title: buildPostShareTitle(input.content, input.userName, input.pets),
    path: buildPostSharePath(input.id),
    query: buildPostShareQuery(input.id),
    imageUrl,
  };
}

export function usePostShareRegistry() {
  onShareAppMessage(() => {
    const share = pendingShare.value;
    if (!share) {
      return {
        title: "萌宠朋友圈",
        path: "/pages/home/index",
      };
    }
    return {
      title: share.title,
      path: share.path,
      imageUrl: share.imageUrl,
    };
  });

  onShareTimeline(() => {
    const share = pendingShare.value;
    if (!share) {
      return { title: "萌宠朋友圈" };
    }
    return {
      title: share.title,
      query: share.query,
      imageUrl: share.imageUrl,
    };
  });
}
