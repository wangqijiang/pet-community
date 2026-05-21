<template>
  <view class="demo-container">
    <view class="header-safe"></view>
    <TopNavBar title="组件演示" :showBack="true" />

    <scroll-view class="demo-content" scroll-y>
      <view class="demo-section">
        <text class="section-title">1. Toast 提示</text>
        <view class="demo-buttons">
          <button class="demo-btn primary" @click="testSuccessToast">成功提示</button>
          <button class="demo-btn error" @click="testErrorToast">错误提示</button>
          <button class="demo-btn warning" @click="testLoadingToast">加载提示</button>
          <button class="demo-btn info" @click="testInfoToast">信息提示</button>
        </view>
      </view>

      <view class="demo-section">
        <text class="section-title">2. Dialog 对话框</text>
        <view class="demo-buttons">
          <button class="demo-btn primary" @click="testConfirm">确认对话框</button>
          <button class="demo-btn error" @click="testAlert">警告对话框</button>
        </view>
      </view>

      <view class="demo-section">
        <text class="section-title">3. ActionSheet 底部菜单</text>
        <view class="demo-buttons">
          <button class="demo-btn primary" @click="showSimpleActionSheet">简单菜单</button>
          <button class="demo-btn primary" @click="showDangerActionSheet">带危险操作</button>
        </view>
      </view>

      <view class="demo-section">
        <text class="section-title">4. Picker 选择器</text>
        <view class="demo-buttons">
          <button class="demo-btn primary" @click="showSimplePicker">单列选择</button>
          <button class="demo-btn primary" @click="showMultiPicker">多列联动</button>
        </view>
      </view>

      <view class="demo-section">
        <text class="section-title">5. DatePicker 日期选择器</text>
        <view class="demo-buttons">
          <button class="demo-btn primary" @click="showDatePicker">选择日期</button>
        </view>
      </view>

      <view class="demo-section">
        <text class="section-title">6. Input 输入框</text>
        <view class="demo-form">
          <Input
            v-model="form.username"
            label="用户名"
            placeholder="请输入用户名"
            :required="true"
            :clearable="true"
            prefixIcon="icon-user"
          />

          <Input
            v-model="form.phone"
            label="手机号"
            placeholder="请输入手机号"
            type="number"
            :maxlength="11"
            prefixIcon="icon-phone"
          />

          <Input
            v-model="form.password"
            label="密码"
            placeholder="请输入密码"
            type="password"
            :required="true"
            suffixIcon="icon-eye"
          />
        </view>
      </view>

      <view class="demo-section">
        <text class="section-title">7. Textarea 文本域</text>
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
    </scroll-view>

    <!-- ActionSheet 组件 -->
    <ActionSheet
      v-model:visible="actionSheet.visible"
      :title="actionSheet.options.title"
      :actions="actionSheet.options.actions"
      @select="onActionSelect"
    />

    <!-- Picker 组件 -->
    <Picker
      v-model:visible="picker.visible"
      :title="picker.options.title"
      :data="picker.options.data"
      @confirm="onPickerConfirm"
    />

    <!-- DatePicker 组件 -->
    <DatePicker
      v-model:visible="datePicker.visible"
      :title="datePicker.options.title"
      :value="datePicker.options.value"
      startDate="2010-01-01"
      endDate="2025-12-31"
      @confirm="onDateConfirm"
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
    data: [] as any[][],
  },
})

const datePicker = reactive({
  visible: false,
  options: {
    title: '',
    value: '',
  },
})

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

const onActionSelect = (item, index) => {
  toast.success(`选择了: ${item.name}`)
}

const showSimplePicker = () => {
  picker.options = {
    title: '选择宠物种类',
    data: [
      [
        { label: '猫咪', value: 'cat' },
        { label: '狗狗', value: 'dog' },
        { label: '兔子', value: 'rabbit' },
        { label: '仓鼠', value: 'hamster' },
      ],
    ],
  }
  picker.visible = true
}

const showMultiPicker = () => {
  picker.options = {
    title: '选择宠物种类和品种',
    data: [
      [
        { label: '猫咪', value: 'cat', children: [
          { label: '英短', value: 'british_shorthair' },
          { label: '美短', value: 'american_shorthair' },
          { label: '布偶', value: 'ragdoll' },
        ]},
        { label: '狗狗', value: 'dog', children: [
          { label: '金毛', value: 'golden' },
          { label: '柯基', value: 'corgi' },
          { label: '泰迪', value: 'poodle' },
        ]},
      ],
    ],
  }
  picker.visible = true
}

const onPickerConfirm = (result) => {
  toast.success(`选择了: ${result.label.join(' - ')}`)
}

const showDatePicker = () => {
  datePicker.options = {
    title: '选择宠物生日',
    value: '',
  }
  datePicker.visible = true
}

const onDateConfirm = (date) => {
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
  padding: 32rpx;
  padding-bottom: 120rpx;
}

.demo-section {
  margin-bottom: 48rpx;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: $font-weight-bold;
  color: $color-gray-dark;
  margin-bottom: 24rpx;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.demo-btn {
  flex: 1;
  min-width: 200rpx;
  padding: 24rpx 32rpx;
  border-radius: $border-radius-medium;
  font-size: $font-size-body;
  font-weight: $font-weight-bold;
  color: #FFFFFF;
  background: $color-primary;
  transition: all 0.3s ease;

  &:active {
    transform: scale(1);
    opacity: 0.8;
  }

  &.primary {
    background: $color-primary;
  }

  &.error {
    background: $color-error;
  }

  &.warning {
    background: $color-warning;
  }

  &.info {
    background: $color-gray-medium;
  }
}

.demo-form {
  background: $color-bg-white;
  border-radius: $border-radius-large;
  padding: 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(168, 155, 157, 0.08);
}
</style>
