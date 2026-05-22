<template>
  <view class="demo-container">
    <view class="header-safe"></view>
    <TopNavBar title="组件演示" :showBack="true" />

    <scroll-view class="demo-content" scroll-y>
      <!-- Toast 提示 -->
      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon toast-icon"></view>
          <text class="section-title">Toast 提示</text>
          <text class="section-badge">5种类型</text>
        </view>
        <view class="section-desc">轻量级反馈组件，支持多种状态提示</view>
        <view class="demo-buttons">
          <view class="demo-btn success" @click="testSuccessToast">
            <view class="btn-icon success-icon"></view>
            <text class="btn-text">成功提示</text>
          </view>
          <view class="demo-btn error" @click="testErrorToast">
            <view class="btn-icon error-icon"></view>
            <text class="btn-text">错误提示</text>
          </view>
          <view class="demo-btn warning" @click="testLoadingToast">
            <view class="btn-icon warning-icon"></view>
            <text class="btn-text">加载提示</text>
          </view>
          <view class="demo-btn info" @click="testInfoToast">
            <view class="btn-icon info-icon"></view>
            <text class="btn-text">信息提示</text>
          </view>
        </view>
      </view>

      <!-- Dialog 对话框 -->
      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon dialog-icon"></view>
          <text class="section-title">Dialog 对话框</text>
          <text class="section-badge">2种模式</text>
        </view>
        <view class="section-desc">用于重要操作确认或信息展示</view>
        <view class="demo-buttons">
          <view class="demo-btn primary" @click="testConfirm">
            <text class="btn-text">确认对话框</text>
          </view>
          <view class="demo-btn outline" @click="testAlert">
            <text class="btn-text">警告对话框</text>
          </view>
        </view>
      </view>

      <!-- ActionSheet 底部菜单 -->
      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon action-icon"></view>
          <text class="section-title">ActionSheet 底部菜单</text>
          <text class="section-badge">灵活配置</text>
        </view>
        <view class="section-desc">底部弹出的操作菜单，支持禁用和危险操作</view>
        <view class="demo-buttons">
          <view class="demo-btn primary" @click="showSimpleActionSheet">
            <text class="btn-text">简单菜单</text>
          </view>
          <view class="demo-btn danger" @click="showDangerActionSheet">
            <text class="btn-text">带危险操作</text>
          </view>
        </view>
      </view>

      <!-- Picker 选择器 -->
      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon picker-icon"></view>
          <text class="section-title">Picker 选择器</text>
          <text class="section-badge">支持多列</text>
        </view>
        <view class="section-desc">单列或多列数据选择，支持联动</view>
        <view class="demo-buttons">
          <view class="demo-btn primary" @click="showSimplePicker">
            <text class="btn-text">单列选择</text>
          </view>
          <view class="demo-btn primary" @click="showMultiPicker">
            <text class="btn-text">多列选择</text>
          </view>
        </view>
        <view v-if="pickerResult" class="result-display">
          <text class="result-label">选择结果：</text>
          <text class="result-value">{{ pickerResult }}</text>
        </view>
      </view>

      <!-- DatePicker 日期选择器 -->
      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon date-icon"></view>
          <text class="section-title">DatePicker 日期选择器</text>
          <text class="section-badge">日期范围</text>
        </view>
        <view class="section-desc">日期选择组件，支持范围限制</view>
        <view class="demo-buttons">
          <view class="demo-btn primary full-width" @click="showDatePicker">
            <text class="btn-text">选择日期</text>
          </view>
        </view>
        <view v-if="dateResult" class="result-display">
          <text class="result-label">选择日期：</text>
          <text class="result-value">{{ dateResult }}</text>
        </view>
      </view>

      <!-- Input 输入框 -->
      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon input-icon"></view>
          <text class="section-title">Input 输入框</text>
          <text class="section-badge">丰富配置</text>
        </view>
        <view class="section-desc">支持前缀图标、清除按钮、字数统计等</view>
        <view class="demo-form">
          <Input
            v-model="form.username"
            label="用户名"
            placeholder="请输入用户名"
            :required="true"
            :clearable="true"
          />

          <Input
            v-model="form.phone"
            label="手机号"
            placeholder="请输入手机号"
            type="number"
            :maxlength="11"
          />

          <Input
            v-model="form.password"
            label="密码"
            placeholder="请输入密码"
            type="password"
            :required="true"
          />
        </view>
      </view>

      <!-- Textarea 文本域 -->
      <view class="demo-section card-section">
        <view class="section-header">
          <view class="section-icon textarea-icon"></view>
          <text class="section-title">Textarea 文本域</text>
          <text class="section-badge">自动增高</text>
        </view>
        <view class="section-desc">多行文本输入，支持字数统计</view>
        <view class="demo-form">
          <Textarea
            v-model="form.description"
            label="描述"
            placeholder="请输入详细描述..."
            :maxlength="200"
            :showWordCount="true"
            :autoHeight="true"
          />
        </view>
      </view>

      <!-- 间距 -->
      <view class="bottom-spacing"></view>
    </scroll-view>

    <!-- ActionSheet 组件 -->
    <ActionSheet
      v-if="actionSheet.visible"
      :title="actionSheet.options.title"
      :actions="actionSheet.options.actions"
      @select="onActionSelect"
      @cancel="actionSheet.visible = false"
    />

    <!-- Picker 组件 -->
    <Picker
      v-if="picker.visible"
      :title="picker.options.title"
      :data="picker.options.data"
      @confirm="(result) => { onPickerConfirm(result); picker.visible = false; }"
      @cancel="picker.visible = false"
    />

    <!-- DatePicker 组件 -->
    <DatePicker
      v-if="datePicker.visible"
      :title="datePicker.options.title"
      :value="datePicker.options.value"
      startDate="2010-01-01"
      endDate="2025-12-31"
      @confirm="(date) => { onDateConfirm(date); datePicker.visible = false; }"
      @cancel="datePicker.visible = false"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import TopNavBar from '@/components/common/TopNavBar.vue'
import { ActionSheet, Picker, DatePicker, Input, Textarea } from '@/components/interactive'
import { useToast, useDialog } from '@/composables/useComponents'

const toast = useToast()
const dialog = useDialog()

const form = reactive({
  username: '',
  phone: '',
  password: '',
  description: '',
})

const actionSheet = reactive({
  visible: false,
  options: {
    title: '',
    actions: [] as any[],
  },
})

const picker = reactive({
  visible: false,
  options: {
    title: '',
    data: [] as any[],
  },
})

const datePicker = reactive({
  visible: false,
  options: {
    title: '',
    value: '',
  },
})

const pickerResult = ref('')
const dateResult = ref('')

const testSuccessToast = () => {
  toast.success('操作成功！')
}

const testErrorToast = () => {
  toast.error('操作失败，请重试')
}

const testLoadingToast = () => {
  toast.loading('正在加载...')
}

const testInfoToast = () => {
  toast.info('这是一条普通信息')
}

const testConfirm = () => {
  dialog.confirm({
    title: '确认删除',
    content: '确定要删除这条动态吗？删除后无法恢复',
    confirmText: '删除',
    confirmColor: '#FF6B8A',
    success: () => {
      toast.success('删除成功')
    },
  })
}

const testAlert = () => {
  dialog.alert({
    title: '温馨提示',
    content: '您的会员即将到期，请及时续费',
    confirmText: '我知道了',
  })
}

const showSimpleActionSheet = () => {
  actionSheet.options = {
    title: '选择操作',
    actions: [
      { name: '编辑', type: 'default' },
      { name: '删除', type: 'default' },
      { name: '分享', type: 'default' },
    ],
  }
  actionSheet.visible = true
}

const showDangerActionSheet = () => {
  actionSheet.options = {
    title: '确认操作',
    actions: [
      { name: '编辑动态', type: 'default' },
      { name: '删除动态', type: 'danger' },
      { name: '复制链接', type: 'default' },
      { name: '举报', type: 'default', disabled: true },
    ],
  }
  actionSheet.visible = true
}

const onActionSelect = (item: any) => {
  toast.success(`选择了: ${item.name}`)
}

const showSimplePicker = () => {
  picker.options = {
    title: '选择宠物种类',
    data: [
      { label: '猫咪', value: 'cat' },
      { label: '狗狗', value: 'dog' },
      { label: '兔子', value: 'rabbit' },
      { label: '仓鼠', value: 'hamster' },
      { label: '鹦鹉', value: 'parrot' },
      { label: '金鱼', value: 'goldfish' },
    ],
  }
  picker.visible = true
}

const showMultiPicker = () => {
  picker.options = {
    title: '选择宠物种类和品种',
    data: [
      [
        { label: '猫咪', value: 'cat' },
        { label: '狗狗', value: 'dog' },
      ],
      [
        { label: '英短', value: 'british_shorthair', alias: 'British' },
        { label: '美短', value: 'american_shorthair', alias: 'American' },
        { label: '金毛', value: 'golden', alias: 'Golden' },
        { label: '柯基', value: 'corgi', alias: 'Corgi' },
        { label: '泰迪', value: 'poodle', alias: 'Poodle' },
      ],
    ],
  }
  picker.visible = true
}

const onPickerConfirm = (result: any) => {
  pickerResult.value = result.label.join(' - ')
  toast.success(`选择了: ${result.label.join(' - ')}`)
}

const showDatePicker = () => {
  datePicker.options = {
    title: '选择宠物生日',
    value: '',
  }
  datePicker.visible = true
}

const onDateConfirm = (date: string) => {
  dateResult.value = date
  toast.success(`选择了: ${date}`)
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.demo-container {
  min-height: 100vh;
  background: $color-bg-primary;
}

.demo-content {
  padding: 24rpx;
  padding-bottom: 160rpx;
  height: calc(100vh - 88rpx);
}

.demo-section {
  margin-bottom: 32rpx;
}

.card-section {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(168, 155, 157, 0.08);
  border: 2rpx solid rgba(113, 88, 92, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}

.section-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-icon {
  background: linear-gradient(135deg, #7ED6A5 0%, #A8E6CF 100%);
  
  &::before {
    content: '';
    width: 28rpx;
    height: 28rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.dialog-icon {
  background: linear-gradient(135deg, #FFB347 0%, #FFD93D 100%);
  
  &::before {
    content: '';
    width: 28rpx;
    height: 28rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.action-icon {
  background: linear-gradient(135deg, #9CB6E0 0%, #C9D8FF 100%);
  
  &::before {
    content: '';
    width: 28rpx;
    height: 28rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.picker-icon {
  background: linear-gradient(135deg, #FFC1E9 0%, #FFD4F0 100%);
  
  &::before {
    content: '';
    width: 28rpx;
    height: 28rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M7 10l5 5 5-5H7z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.date-icon {
  background: linear-gradient(135deg, #FFB6C1 0%, #FFC0CB 100%);
  
  &::before {
    content: '';
    width: 28rpx;
    height: 28rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.input-icon {
  background: linear-gradient(135deg, #DAEAD8 0%, #E8F5E9 100%);
  
  &::before {
    content: '';
    width: 28rpx;
    height: 28rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235B6A5C'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.textarea-icon {
  background: linear-gradient(135deg, #FCE9EB 0%, #FDF0F2 100%);
  
  &::before {
    content: '';
    width: 28rpx;
    height: 28rpx;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2371585C'%3E%3Cpath d='M14.01 21v-7.391c0-5.704 3.731-9.57 8.989-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.99zm-14.01 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.986v10h-9.986zm6.005-8c0-1.103.897-2 2-2s2 .897 2 2-.897 2-2 2-2-.897-2-2z'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
}

.section-badge {
  margin-left: auto;
  padding: 6rpx 16rpx;
  background: rgba(113, 88, 92, 0.1);
  border-radius: 20rpx;
  font-size: 22rpx;
  color: $color-gray-medium;
}

.section-desc {
  font-size: 26rpx;
  color: $color-gray-medium;
  margin-bottom: 24rpx;
  line-height: 1.5;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.demo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  min-width: 180rpx;
  padding: 24rpx 32rpx;
  border-radius: $border-radius-medium;
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:active {
    transform: scale(0.96);
    opacity: 0.85;
  }

  &.full-width {
    width: 100%;
  }

  &.primary {
    background: linear-gradient(135deg, $color-primary 0%, #FFD4F0 100%);
    box-shadow: 0 8rpx 24rpx rgba(113, 88, 92, 0.15);

    .btn-text {
      color: $color-bg-white;
    }
  }

  &.success {
    background: linear-gradient(135deg, #7ED6A5 0%, #A8E6CF 100%);
    box-shadow: 0 8rpx 24rpx rgba(126, 214, 165, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.error {
    background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
    box-shadow: 0 8rpx 24rpx rgba(255, 107, 107, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.warning {
    background: linear-gradient(135deg, #FFB347 0%, #FFD93D 100%);
    box-shadow: 0 8rpx 24rpx rgba(255, 179, 71, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.info {
    background: linear-gradient(135deg, #9CB6E0 0%, #C9D8FF 100%);
    box-shadow: 0 8rpx 24rpx rgba(156, 182, 224, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.danger {
    background: linear-gradient(135deg, #FF6B8A 0%, #FF8FB3 100%);
    box-shadow: 0 8rpx 24rpx rgba(255, 107, 138, 0.3);

    .btn-text {
      color: #FFFFFF;
    }
  }

  &.outline {
    background: transparent;
    border: 2rpx solid $color-primary;

    .btn-text {
      color: $color-primary;
    }

    &:active {
      background: rgba(113, 88, 92, 0.05);
    }
  }
}

.btn-icon {
  width: 32rpx;
  height: 32rpx;
}

.success-icon {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.error-icon {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.warning-icon {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.info-icon {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FFFFFF'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'/%3E%3C/svg%3E") no-repeat center;
  background-size: 100%;
}

.btn-text {
  font-size: $font-size-body;
  font-weight: 600;
}

.demo-form {
  padding: 8rpx 0;
}

.result-display {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  padding: 20rpx;
  background: rgba(252, 218, 223, 0.3);
  border-radius: $border-radius-medium;
}

.result-label {
  font-size: $font-size-body;
  color: $color-gray-medium;
}

.result-value {
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: $color-primary;
  margin-left: 8rpx;
}

.bottom-spacing {
  height: 48rpx;
}

.header-safe {
  height: constant(safe-area-inset-top);
  height: env(safe-area-inset-top);
}
</style>