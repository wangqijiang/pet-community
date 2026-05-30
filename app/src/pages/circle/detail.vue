<template>
  <PageLayout :footer-height="commentBarHeight">
    <template #navbar>
      <TopNavBar title="动态详情" :showBack="true" />
    </template>
    <view class="detail-inner">
      <view v-if="loading" class="loading-container">
        <Loading />
      </view>
      
      <view v-else class="detail-content">
        <view class="detail-card">
          <view class="card-header">
            <view class="user-left">
              <view class="user-avatar">
                <image v-if="post.avatar" :src="getAvatarUrl(post.avatar)" mode="aspectFill" />
                <view v-else class="avatar-placeholder"></view>
              </view>
              <view class="user-info">
                <text class="user-name">{{ post.username }}</text>
                <text class="user-meta">{{ formatTime(post.created_at) }}</text>
              </view>
            </view>
            <view class="header-right">
              <view v-if="isOwnPost()" class="delete-btn" @click="handleDelete">
                <view class="delete-icon"></view>
              </view>
              <view v-else class="more-icon"></view>
            </view>
          </view>

          <text class="card-content">{{ post.content }}</text>

          <PostImageGrid :images="post.images" />

          <view class="card-footer">
            <view class="footer-left">
              <view class="footer-item" @click="handleLike">
                <view class="footer-icon" :class="{ liked: liked }">
                  <text class="like-icon">{{ liked ? '♥' : '♡' }}</text>
                </view>
                <text class="footer-count">{{ likes }}</text>
              </view>
              <view class="footer-item">
                <view class="footer-icon">
                  <text class="comment-icon">💬</text>
                </view>
                <text class="footer-count">{{ comments }}</text>
              </view>
            </view>
            <view class="footer-item" @click="handleShare">
              <text class="share-icon">↗</text>
            </view>
          </view>
        </view>

        <view class="comment-section">
          <view class="section-header">
            <text class="section-title">评论 ({{ comments }})</text>
          </view>

          <view v-if="commentsList.length === 0" class="no-comment">
            <text>暂无评论，快来发表第一条评论吧</text>
          </view>

          <template v-for="comment in nestedComments" :key="comment.id">
            <view
              class="comment-item"
              @longpress="showCommentAction(comment)"
            >
              <view class="comment-avatar">
                <image v-if="comment.avatar" :src="getAvatarUrl(comment.avatar)" mode="aspectFill" />
                <view v-else class="avatar-placeholder"></view>
              </view>
              <view class="comment-content-wrapper">
                <view class="comment-content">
                  <view class="comment-header">
                    <text class="comment-name">{{ comment.username }}</text>
                    <text class="comment-time">{{ formatTime(comment.created_at) }}</text>
                  </view>
                  <view class="comment-text-wrapper">
                    <text class="comment-text">{{ comment.content }}</text>
                  </view>
                </view>
                <view 
                  v-if="canDeleteComment(comment)" 
                  class="comment-delete-btn"
                  @click.stop="handleDeleteComment(comment)"
                >
                  <text>删除</text>
                </view>
              </view>
              <view class="comment-actions">
                <view 
                  class="comment-reply-btn" 
                  @click="handleReply(comment)"
                >
                  <text>回复</text>
                </view>
                <view 
                  v-if="comment.replies.length > 0"
                  class="comment-expand-btn"
                  @click="toggleExpand(comment.id)"
                >
                  <text>{{ isExpanded(comment.id) ? `收起(${comment.replies.length})` : `查看(${comment.replies.length})` }}</text>
                </view>
              </view>
            </view>

            <view 
              v-if="comment.replies.length > 0 && isExpanded(comment.id)"
              class="replies-section"
            >
              <view
                v-for="reply in comment.replies"
                :key="reply.id"
                class="reply-item"
                @longpress="showCommentAction(reply)"
              >
                <view class="reply-avatar">
                  <image v-if="reply.avatar" :src="getAvatarUrl(reply.avatar)" mode="aspectFill" />
                  <view v-else class="avatar-placeholder"></view>
                </view>
                <view class="reply-content-wrapper">
                  <view class="reply-content">
                    <view class="reply-header">
                      <text class="reply-name">{{ reply.username }}</text>
                      <text class="reply-time">{{ formatTime(reply.created_at) }}</text>
                    </view>
                    <view class="reply-text-wrapper">
                      <text v-if="reply.reply_to_name" class="reply-label">@{{ reply.reply_to_name }}:</text>
                      <text class="reply-text">{{ reply.content }}</text>
                    </view>
                  </view>
                  <view 
                    v-if="canDeleteComment(reply)" 
                    class="reply-delete-btn"
                    @click.stop="handleDeleteComment(reply)"
                  >
                    <text>删除</text>
                  </view>
                </view>
                <view 
                  class="reply-reply-btn" 
                  @click="handleReply(reply)"
                >
                  <text>回复</text>
                </view>
              </view>
            </view>
          </template>

          <view v-if="loadingComments" class="loading-comments">
            <view class="loading-dots">
              <view class="dot"></view>
              <view class="dot"></view>
              <view class="dot"></view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <template #fixed>
    <view 
      class="comment-input-bar"
      :class="{ 'show-reply': replyingComment }"
    >
      <view v-if="replyingComment" class="reply-hint">
        <text>回复 {{ replyingComment.username }}</text>
        <view class="close-reply" @click="cancelReply">×</view>
      </view>
      <input
        class="comment-input"
        v-model="commentContent"
        :placeholder="replyingComment ? '写下你的回复...' : '写下你的评论...'"
        confirm-type="send"
        @confirm="submitComment"
        :focus="showInputFocus"
      />
      <view 
        class="send-btn" 
        :class="{ active: commentContent.trim() }" 
        @click="submitComment"
      >
        <text>发送</text>
      </view>
    </view>

    <view v-if="showActionSheet" class="action-sheet-mask" @click="closeActionSheet">
      <view class="action-sheet" @click.stop>
        <view 
          v-if="canDeleteComment(selectedComment)" 
          class="action-item delete-action"
          @click="handleDeleteComment(selectedComment)"
        >
          <text>删除评论</text>
        </view>
        <view class="action-item cancel-action" @click="closeActionSheet">
          <text>取消</text>
        </view>
      </view>
    </view>
    </template>

    <Loading :visible="submitLoading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import TopNavBar from "@/components/common/TopNavBar.vue";
import PageLayout from "@/components/common/PageLayout.vue";
import PostImageGrid from "@/components/common/PostImageGrid.vue";
import Loading from "@/components/common/Loading.vue";
import {
  getPostDetail,
  getComments,
  toggleLikePost,
  addComment,
  deletePost,
  deleteComment,
  checkLiked,
  type Post,
  type Comment,
} from "@/api/post";
import { getUserInfo } from "@/api/auth";

const commentBarHeight = uni.upx2px(120);

const loading = ref(false);
const loadingComments = ref(false);
const submitLoading = ref(false);
const post = ref<Post & { images: string[] }>({
  id: 0,
  user_id: 0,
  username: "",
  avatar: "",
  content: "",
  images: [],
  likes: 0,
  comments: 0,
  created_at: ""
});
const commentsList = ref<Comment[]>([]);
const expandedComments = ref<Set<number>>(new Set());

interface NestedComment extends Comment {
  replies: NestedComment[];
  isExpanded?: boolean;
}

const nestedComments = computed(() => {
  const map = new Map<number, NestedComment>();
  const topLevel: NestedComment[] = [];

  commentsList.value.forEach(comment => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  commentsList.value.forEach(comment => {
    const nestedComment = map.get(comment.id)!;
    
    if (!comment.reply_to_id) {
      topLevel.push(nestedComment);
    } else {
      const parentComment = map.get(comment.reply_to_id);
      if (parentComment) {
        parentComment.replies.push(nestedComment);
      } else {
        topLevel.push(nestedComment);
      }
    }
  });

  topLevel.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  topLevel.forEach(comment => {
    comment.replies.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });

  return topLevel;
});

const toggleExpand = (commentId: number) => {
  if (expandedComments.value.has(commentId)) {
    expandedComments.value.delete(commentId);
  } else {
    expandedComments.value.add(commentId);
  }
  expandedComments.value = new Set(expandedComments.value);
};

const isExpanded = (commentId: number) => {
  return expandedComments.value.has(commentId);
};
const liked = ref(false);
const likes = ref(0);
const comments = ref(0);
const commentContent = ref("");
const page = ref(1);
const size = ref(10);
const currentUser = ref(getUserInfo());
const replyingComment = ref<Comment | null>(null);
const showInputFocus = ref(false);
const showActionSheet = ref(false);
const selectedComment = ref<Comment | null>(null);

const isOwnPost = () => {
  return currentUser.value && currentUser.value.id === post.value.user_id;
};

const canDeleteComment = (comment: Comment) => {
  if (!currentUser.value) return false;
  return currentUser.value.id === comment.user_id || isOwnPost();
};

const getAvatarUrl = (avatar: string) => {
  if (!avatar) return "";
  if (avatar.startsWith("http")) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || "https://api.example.com"}${avatar}`;
};

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const loadPost = async () => {
  loading.value = true;
  try {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1] as any;
    const options = currentPage.options;
    
    if (options && options.id) {
      const data = await getPostDetail(parseInt(options.id));
      post.value = {
        ...data,
        images: typeof data.images === 'string' ? JSON.parse(data.images) : data.images
      };
      likes.value = data.likes;
      comments.value = data.comments;
      
      if (currentUser.value) {
        try {
          const likedResult = await checkLiked(data.id);
          liked.value = likedResult.liked;
        } catch (error) {
          console.warn("检查点赞状态失败:", error);
        }
      }
      
      await loadComments();
    }
  } catch (error) {
    console.error("获取动态详情失败:", error);
    uni.showToast({ title: "加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
};

const loadComments = async () => {
  loadingComments.value = true;
  try {
    const response = await getComments(post.value.id, page.value, size.value);
    commentsList.value = response.list;
  } catch (error) {
    console.error("获取评论失败:", error);
  } finally {
    loadingComments.value = false;
  }
};

const handleLike = async () => {
  uni.vibrateShort({ type: "light" });
  try {
    const res = await toggleLikePost(post.value.id);
    liked.value = res.liked;
    likes.value = Math.max(0, likes.value + (res.liked ? 1 : -1));
  } catch {
    uni.showToast({ title: "操作失败", icon: "none" });
  }
};

const handleShare = () => {
  uni.showShareMenu({
    withShareTicket: true,
  });
};

const handleDelete = async () => {
  uni.showModal({
    title: "确认删除",
    content: "确定要删除这条动态吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          await deletePost(post.value.id);
          uni.showToast({ title: "删除成功", icon: "success" });
          setTimeout(() => {
            uni.navigateBack();
          }, 1500);
        } catch (error) {
          console.error("删除失败:", error);
          uni.showToast({ title: "删除失败", icon: "none" });
        }
      }
    }
  });
};

const handleReply = (comment: Comment) => {
  replyingComment.value = comment;
  showInputFocus.value = true;
};

const cancelReply = () => {
  replyingComment.value = null;
  commentContent.value = "";
  showInputFocus.value = false;
};

const submitComment = async () => {
  if (!commentContent.value.trim()) {
    uni.showToast({ title: "请输入评论内容", icon: "none" });
    return;
  }
  
  submitLoading.value = true;
  try {
    await addComment(post.value.id, commentContent.value, replyingComment.value?.id);
    uni.showToast({ title: "评论成功", icon: "success" });
    commentContent.value = "";
    comments.value++;
    await loadComments();
    cancelReply();
  } catch (error) {
    console.error("评论失败:", error);
    uni.showToast({ title: "评论失败", icon: "none" });
  } finally {
    submitLoading.value = false;
  }
};

const showCommentAction = (comment: Comment) => {
  selectedComment.value = comment;
  showActionSheet.value = true;
};

const closeActionSheet = () => {
  showActionSheet.value = false;
  selectedComment.value = null;
};

const handleDeleteComment = async (comment: Comment) => {
  closeActionSheet();
  uni.showModal({
    title: "确认删除",
    content: "确定要删除这条评论吗？",
    success: async (res) => {
      if (res.confirm) {
        try {
          await deleteComment(comment.id);
          uni.showToast({ title: "删除成功", icon: "success" });
          await loadComments();
          await loadPost();
        } catch (error) {
          console.error("删除评论失败:", error);
          uni.showToast({ title: "删除失败", icon: "none" });
        }
      }
    }
  });
};

const previewImage = (item: any, index: number) => {
  if (!item.images || item.images.length === 0) return;
  
  uni.previewImage({
    urls: item.images,
    current: index,
  });
};

onMounted(() => {
  loadPost();
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.detail-container {
  min-height: 100vh;
  background: $color-bg-primary;
  display: flex;
  flex-direction: column;
}

.detail-inner {
  padding: 0 32rpx 24rpx;
  box-sizing: border-box;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 200rpx 0;
}

.detail-content {
  padding: 32rpx;
}

.detail-card {
  background: $color-bg-white;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 12rpx 40rpx rgba(107, 78, 61, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}

.user-left {
  display: flex;
  gap: 24rpx;
  align-items: center;
}

.user-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #FFC1E9, #FFD4F0);
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.user-name {
  font-size: 32rpx;
  font-weight: 700;
  color: #3D2F2F;
}

.user-meta {
  font-size: 24rpx;
  color: #9B9090;
}

.header-right {
  display: flex;
  align-items: center;
}

.more-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #7A6E6E;
}

.delete-btn {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff0f0;
  border-radius: 50%;
  
  &:active {
    background: #ffe0e0;
  }
}

.delete-icon {
  width: 32rpx;
  height: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #E53935;
}

.card-content {
  font-size: 32rpx;
  color: #4D3E3E;
  line-height: 1.8;
  margin-bottom: 28rpx;
}

.card-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.image-item {
  aspect-ratio: 1;
  border-radius: 16rpx;
  background: #F5F5F5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16rpx;
  border-top: 1rpx solid #F5F0F0;
}

.footer-left {
  display: flex;
  gap: 48rpx;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.footer-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  
  &.liked {
    animation: likeAnimation 0.3s ease;
  }
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.like-icon {
  font-size: 36rpx;
  color: #C4B5B5;
}

.footer-icon.liked .like-icon {
  color: #FF6B6B;
}

.comment-icon {
  font-size: 32rpx;
  color: #C4B5B5;
}

.footer-count {
  font-size: 26rpx;
  color: #9B9090;
}

.share-icon {
  font-size: 32rpx;
  color: #C4B5B5;
}

.comment-section {
  background: $color-bg-white;
  border-radius: 24rpx;
  padding: 32rpx;
}

.section-header {
  margin-bottom: 28rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3D2F2F;
}

.no-comment {
  text-align: center;
  padding: 80rpx 0;
  color: #9B9090;
  font-size: 28rpx;
}

.comment-item {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #F5F0F0;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #F8F8F8;
  }
  
  &.comment-item-reply {
    padding-left: 40rpx;
    background-color: #FAFAFA;
    margin-left: -32rpx;
    margin-right: -32rpx;
    padding-left: 72rpx;
  }
}

.comment-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.comment-content-wrapper {
  flex: 1;
  position: relative;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.comment-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #3D2F2F;
}

.comment-time {
  font-size: 22rpx;
  color: #9B9090;
}

.comment-text-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.reply-label {
  font-size: 28rpx;
  color: #7B5B45;
  font-weight: 500;
}

.comment-text {
  font-size: 28rpx;
  color: #4D3E3E;
  line-height: 1.6;
}

.comment-delete-btn {
  position: absolute;
  right: 0;
  top: 0;
  padding: 8rpx 20rpx;
  background: #fff0f0;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: #E53935;
  
  &:active {
    background: #ffe0e0;
  }
}

.comment-actions {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.comment-reply-btn {
  padding: 8rpx 20rpx;
  font-size: 24rpx;
  color: #7B5B45;
}

.comment-expand-btn {
  padding: 8rpx 20rpx;
  font-size: 22rpx;
  color: #9B9090;
  background: #F5F5F5;
  border-radius: 20rpx;
}

.replies-section {
  background: #FAFAFA;
  margin-left: -32rpx;
  margin-right: -32rpx;
  padding-left: 104rpx;
  padding-right: 32rpx;
  border-top: 1rpx solid #F0F0F0;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000rpx;
  }
}

.reply-item {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #F0F0F0;
  transition: background-color 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:active {
    background-color: #F0F0F0;
  }
}

.reply-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.reply-content-wrapper {
  flex: 1;
  position: relative;
}

.reply-content {
  flex: 1;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}

.reply-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #3D2F2F;
}

.reply-time {
  font-size: 20rpx;
  color: #9B9090;
}

.reply-text-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6rpx;
}

.reply-label {
  font-size: 26rpx;
  color: #7B5B45;
  font-weight: 500;
}

.reply-text {
  font-size: 26rpx;
  color: #4D3E3E;
  line-height: 1.5;
}

.reply-delete-btn {
  position: absolute;
  right: 0;
  top: 0;
  padding: 6rpx 16rpx;
  background: #fff0f0;
  border-radius: 16rpx;
  font-size: 22rpx;
  color: #E53935;
  
  &:active {
    background: #ffe0e0;
  }
}

.reply-reply-btn {
  padding: 6rpx 16rpx;
  font-size: 22rpx;
  color: #7B5B45;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  .reply-item:active &,
  .reply-item:hover & {
    opacity: 1;
  }
}

.loading-comments {
  text-align: center;
  padding: 32rpx 0;
}

.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8rpx;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #C4B5B5;
  animation: dotLoading 1.4s infinite ease-in-out both;
  
  &:nth-child(1) { animation-delay: -0.32s; }
  &:nth-child(2) { animation-delay: -0.16s; }
}

@keyframes dotLoading {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.comment-input-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  gap: 24rpx;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: $color-bg-white;
  border-top: 1rpx solid #F5F0F0;
  transition: all 0.3s ease;
  z-index: 100;
  
  &.show-reply {
    padding-top: 60rpx;
  }
}

.reply-hint {
  position: absolute;
  top: 0;
  left: 32rpx;
  right: 32rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  font-size: 26rpx;
  color: #7B5B45;
  background: #FFF8F0;
  border-radius: 16rpx 16rpx 0 0;
}

.close-reply {
  font-size: 36rpx;
  color: #9B9090;
  padding: 0 16rpx;
}

.comment-input {
  flex: 1;
  height: 88rpx;
  background: #F5F5F5;
  border-radius: 44rpx;
  padding: 0 32rpx;
  font-size: 28rpx;
  transition: background-color 0.2s ease;
  
  &:focus {
    background: #FFFFFF;
    border: 2rpx solid #FFB6C1;
  }
}

.send-btn {
  padding: 24rpx 48rpx;
  background: #E8E8E8;
  border-radius: 44rpx;
  color: #9B9090;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.2s ease;
  transform: scale(1);
  
  &.active {
    background: linear-gradient(135deg, #FFB6C1, #FFC1E9);
    color: white;
    box-shadow: 0 8rpx 24rpx rgba(255, 182, 193, 0.3);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.action-sheet-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.action-sheet {
  width: 100%;
  background: white;
  border-radius: 32rpx 32rpx 0 0;
  padding: 24rpx 0 calc(24rpx + env(safe-area-inset-bottom));
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.action-item {
  padding: 32rpx;
  text-align: center;
  font-size: 32rpx;
  color: #3D2F2F;
  border-bottom: 1rpx solid #F5F0F0;
  
  &:last-child {
    border-bottom: none;
    margin-top: 16rpx;
  }
  
  &.delete-action {
    color: #E53935;
    font-weight: 600;
  }
  
  &.cancel-action {
    background: #F8F8F8;
    margin-top: 16rpx;
    margin-left: 24rpx;
    margin-right: 24rpx;
    border-radius: 16rpx;
  }
  
  &:active {
    background: #F5F5F5;
  }
}
</style>