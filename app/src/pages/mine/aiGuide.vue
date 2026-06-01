<template>
  <PageLayout :footer-height="footerHeight">
    <template #navbar>
      <TopNavBar title="专属养宠攻略" :showBack="true" />
    </template>

    <view class="page-inner ai-guide-inner">
        <!-- AI Banner -->
        <view class="ai-banner">
          <view class="ai-content">
            <view class="ai-tag">
              <text class="tag-text">智能养宠</text>
            </view>
            <text class="ai-title">{{ bannerTitle }}</text>
            <text class="ai-desc">{{ bannerDesc }}</text>
          </view>
          <view class="ai-decoration decoration-1"></view>
          <view class="ai-decoration decoration-2"></view>
        </view>

        <!-- 攻略详情卡片 -->
        <view class="guide-card">
          <!-- 顶部图片 -->
          <view class="guide-header">
            <image
              class="guide-cover"
              src="/static/images/post-default.png"
              mode="aspectFill"
            ></image>
            <view class="gradient-overlay"></view>
          </view>

          <!-- 攻略内容 -->
          <view class="guide-content">
            <view
              v-for="(section, index) in guideSections"
              :key="index"
              class="guide-section"
            >
              <view class="section-header">
                <view
                  class="section-icon-wrapper"
                  :class="sectionIconClass(index)"
                >
                  <view class="section-icon" :class="sectionIconName(index)"></view>
                </view>
                <text class="section-title">{{ section.title }}</text>
              </view>
              <view class="section-body">
                <text class="section-text">{{ section.content }}</text>
              </view>
            </view>

            <!-- 进度指示器 -->
            <view class="progress-indicator">
              <view class="progress-dot"></view>
              <view class="progress-bar"></view>
              <view class="progress-dot"></view>
            </view>
          </view>
        </view>

        <!-- 小贴士 -->
        <view class="tips-card">
          <view class="tips-icon"></view>
          <view class="tips-content">
            <text class="tips-title">小贴士</text>
            <text class="tips-text">点击下方按钮可一键生成海报，保存这份心动攻略哦～</text>
          </view>
        </view>
    </view>

    <template #fixed>
    <view id="ai-guide-footer" class="bottom-actions">
      <view class="action-btn secondary" @tap="saveImage">
        <view class="btn-icon download"></view>
        <text class="btn-text">保存图片</text>
      </view>
      <view class="action-btn primary" @tap="shareToCircle">
        <view class="btn-icon share"></view>
        <text class="btn-text">分享到萌宠圈</text>
      </view>
    </view>
    </template>

    <Loading :visible="loading" />
  </PageLayout>
</template>

<script setup lang="ts">
import { showRequestError } from "@/utils/request";
import { ref, onMounted, computed } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import PageLayout from '@/components/common/PageLayout.vue'
import Loading from '@/components/common/Loading.vue'
import { useFixedFooterHeight } from '@/composables/useLayout'

const { footerHeight } = useFixedFooterHeight('#ai-guide-footer', 24 + 96 + 24 + 32)

import { getPetList } from '@/api/pet'
import { sendAiChat } from '@/api/ai'
import { getGuideList } from '@/api/guide'
import { formatPetAge } from '@/utils/format'
import { promptLogin } from '@/api/auth'
import {
  buildGuideShareText,
  saveAiGuidePublishDraft,
} from '@/utils/aiGuideDraft'

const loading = ref(false)
const bannerTitle = ref('正在生成专属养宠攻略...')
const bannerDesc = ref('基于毛孩子的年龄、品种与生活习性深度定制')
const guideSections = ref<Array<{ title: string; content: string }>>([])

const sectionIconClass = (index: number) =>
  ['tertiary', 'secondary', 'primary'][index % 3]

const sectionIconName = (index: number) =>
  (['restaurant', 'run', 'heart'] as const)[index % 3]

const parseGuideContent = (text: string, fallbackTitle = '养宠建议') => {
  const blocks = text.split(/\n\n+/).filter(Boolean)
  if (blocks.length <= 1) {
    return [{ title: fallbackTitle, content: text.trim() }]
  }
  return blocks.map((block, i) => {
    const lines = block.split('\n')
    const first = lines[0].replace(/^[\d#.、\s]+/, '').trim()
    const hasTitle = first.length <= 20 && lines.length > 1
    return {
      title: hasTitle ? first : `建议 ${i + 1}`,
      content: hasTitle ? lines.slice(1).join('\n').trim() : block.trim(),
    }
  })
}

onMounted(() => {
  loadGuide()
})

const loadGuide = async () => {
  loading.value = true
  try {
    const pets = await getPetList()
    if (pets.length > 0) {
      const pet = pets[0]
      const typeLabel = pet.type === 'cat' ? '猫咪' : pet.type === 'dog' ? '狗狗' : '宠物'
      bannerTitle.value = `为「${pet.name}」定制的成长秘籍`
      bannerDesc.value = `${pet.breed} · ${formatPetAge(pet.age)} · ${typeLabel}`
      const { answer } = await sendAiChat(
        `请为我的${typeLabel}「${pet.name}」（品种：${pet.breed}，年龄：${formatPetAge(pet.age)}）生成健康膳食、运动和日常护理方面的养宠建议`,
        pet.id,
      )
      guideSections.value = parseGuideContent(answer, 'AI 养宠建议')
      return
    }
    const { list } = await getGuideList({ page: 1, size: 1 })
    if (list.length > 0) {
      const guide = list[0]
      bannerTitle.value = guide.title
      bannerDesc.value = '来自社区精选攻略'
      guideSections.value = parseGuideContent(guide.content, guide.title)
    } else {
      guideSections.value = [
        {
          title: '温馨提示',
          content: '请先添加宠物，AI 将为你生成更精准的养宠建议。',
        },
      ]
    }
  } catch (error) {
    showRequestError(error, "加载失败");
    guideSections.value = [
      { title: '加载失败', content: '请检查网络后重试' },
    ]
  } finally {
    loading.value = false
  }
}

const saveImage = () => {
  uni.vibrateShort({ type: 'light' })
  const text = buildGuideShareText(bannerTitle.value, guideSections.value)
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showModal({
        title: '攻略已复制',
        content: '全文已复制到剪贴板，可粘贴到备忘录或聊天中保存。',
        showCancel: false,
      })
    },
  })
}

const shareToCircle = () => {
  if (!promptLogin()) return
  uni.vibrateShort({ type: 'medium' })
  const content = buildGuideShareText(bannerTitle.value, guideSections.value)
  saveAiGuidePublishDraft({
    title: bannerTitle.value,
    content,
  })
  uni.navigateTo({ url: '/pages/circle/publish?fromAi=1' })
}
</script>

<style lang="scss" scoped>
@import "@/styles/layout.scss";

.ai-guide-inner {
  padding-top: 0;
  background: #fff8f7;
  min-height: 100%;
}

/* AI Banner */
.ai-banner {
  position: relative;
  background: #ffdde2;
  border-radius: 48rpx;
  padding: 48rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.15);
  border: 4rpx solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.ai-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16rpx;
}

.ai-tag {
  background: rgba(255, 255, 255, 0.6);
  padding: 8rpx 24rpx;
  border-radius: 100rpx;
  backdrop-filter: blur(10px);
}

.tag-text {
  font-size: 20rpx;
  font-weight: 700;
  color: #795f64;
  letter-spacing: 0.05em;
}

.ai-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #795f64;
}

.ai-desc {
  font-size: 26rpx;
  color: #584145;
  opacity: 0.8;
}

.ai-decoration {
  position: absolute;
  width: 192rpx;
  height: 192rpx;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585c'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
  opacity: 0.15;

  &.decoration-1 {
    right: -32rpx;
    bottom: -32rpx;
  }

  &.decoration-2 {
    left: -48rpx;
    top: -48rpx;
    opacity: 0.1;
    transform: scale(0.8);
  }
}

/* 攻略详情卡片 */
.guide-card {
  background: #ffffff;
  border-radius: 48rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.12);
  border: 2rpx solid rgba(210, 195, 196, 0.2);
  margin-bottom: 32rpx;
}

.guide-header {
  position: relative;
  height: 320rpx;
}

.guide-cover {
  width: 100%;
  height: 100%;
}

.gradient-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: linear-gradient(to top, #ffffff, transparent);
}

.guide-content {
  padding: 48rpx;
}

.guide-section {
  margin-bottom: 48rpx;

  &:last-of-type {
    margin-bottom: 32rpx;
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.section-icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.primary {
    background: #ffdde2;
  }

  &.secondary {
    background: #eadfbd;
  }

  &.tertiary {
    background: #daead8;
  }
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;

  &.restaurant {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235b6a5c'%3E%3Cpath d='M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z'/%3E%3C/svg%3E");
  }

  &.run {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236a6347'%3E%3Cpath d='M13 2l3.05 7.26L22 9.27l-5 4.87 1.17 6.88L13 17.77l-6.18 3.25L8 14.14 3 9.27l6.95-2.01L13 2z'/%3E%3C/svg%3E");
  }

  &.heart {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23795f64'%3E%3Cpath d='M12 2l-2.5 5-5 .7 3.7 3.6-.9 5.1 4.7-2.5 4.7 2.5-.9-5.1 3.7-3.6-5-.7L12 2z'/%3E%3C/svg%3E");
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #71585c;
}

.section-body {
  padding: 24rpx;
  background: #f9f2f2;
  border-radius: 32rpx;
  border-left: 8rpx solid #71585c;
}

.section-text {
  font-size: 28rpx;
  color: #4f4446;
  line-height: 1.7;
  white-space: pre-wrap;
}

.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-top: 16rpx;
}

.progress-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #d2c3c4;
}

.progress-bar {
  width: 120rpx;
  height: 8rpx;
  border-radius: 4rpx;
  background: linear-gradient(90deg, #71585c, #ffdde2);
}

.tips-card {
  display: flex;
  align-items: flex-start;
  gap: 24rpx;
  padding: 40rpx;
  background: rgba(218, 234, 216, 0.3);
  border-radius: 48rpx;
  border: 2rpx solid rgba(218, 234, 216, 0.5);
  margin-bottom: 32rpx;
}

.tips-icon {
  width: 48rpx;
  height: 48rpx;
  flex-shrink: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23546254'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: 100%;
}

.tips-content {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
  min-width: 0;
}

.tips-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #3c4a3d;
}

.tips-text {
  font-size: 26rpx;
  color: #3c4a3d;
  line-height: 1.6;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 24rpx;
  padding: 24rpx 40rpx calc(24rpx + env(safe-area-inset-bottom));
  background: #fff8f7;
  box-shadow: 0 -8rpx 32rpx rgba(168, 155, 157, 0.12);
}

.action-btn {
  flex: 1;
  height: 96rpx;
  border-radius: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;

  &.secondary {
    background: #ffffff;
    border: 2rpx solid rgba(113, 88, 92, 0.2);
  }

  &.primary {
    background: #71585c;
    box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.25);
  }
}

.btn-text {
  font-size: 28rpx;
  font-weight: 600;

  .secondary & {
    color: #71585c;
  }

  .primary & {
    color: #ffffff;
  }
}

.btn-icon {
  width: 40rpx;
  height: 40rpx;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;

  &.download {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z'/%3E%3C/svg%3E");
  }

  &.share {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z'/%3E%3C/svg%3E");
  }
}
</style> 