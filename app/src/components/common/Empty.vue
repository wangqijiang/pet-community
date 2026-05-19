<template>
  <view class="empty-container">
    <view class="empty-illustration">
      <view :class="['illustration', `illustration-${type}`]"></view>
    </view>
    <view class="empty-text">{{ text }}</view>
    <view class="empty-btn" v-if="showBtn" @click="handleClick">
      {{ btnText }}
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  type?: string
  text?: string
  showBtn?: boolean
  btnText?: string
}>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style lang="scss" scoped>
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-illustration {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 32rpx;
}

.illustration {
  width: 100%;
  height: 100%;
  
  &.illustration-default {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='55' r='25' fill='%23FFC1E9'/%3E%3Ccircle cx='42' cy='50' r='3' fill='%23333'/%3E%3Ccircle cx='58' cy='50' r='3' fill='%23333'/%3E%3Cpath d='M45 60 Q50 65 55 60' stroke='%23333' stroke-width='2' fill='none'/%3E%3Ccircle cx='35' cy='45' r='4' fill='%23FFC1E9'/%3E%3Ccircle cx='65' cy='45' r='4' fill='%23FFC1E9'/%3E%3Ccircle cx='38' cy='38' r='3' fill='%23FFC1E9'/%3E%3Ccircle cx='62' cy='38' r='3' fill='%23FFC1E9'/%3E%3Ccircle cx='40' cy='34' r='2' fill='%23FFC1E9'/%3E%3Ccircle cx='60' cy='34' r='2' fill='%23FFC1E9'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.illustration-dog {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cellipse cx='50' cy='60' rx='28' ry='25' fill='%23FFC1E9'/%3E%3Ccircle cx='50' cy='35' r='20' fill='%23FFC1E9'/%3E%3Ccircle cx='42' cy='32' r='2.5' fill='%23333'/%3E%3Ccircle cx='58' cy='32' r='2.5' fill='%23333'/%3E%3Cellipse cx='50' cy='40' rx='4' ry='3' fill='%23333'/%3E%3Cpath d='M46 46 Q50 50 54 46' stroke='%23333' stroke-width='1.5' fill='none'/%3E%3Cellipse cx='35' cy='25' rx='6' ry='8' fill='%23FFC1E9'/%3E%3Cellipse cx='65' cy='25' rx='6' ry='8' fill='%23FFC1E9'/%3E%3Cellipse cx='38' cy='18' rx='4' ry='5' fill='%23FFC1E9'/%3E%3Cellipse cx='62' cy='18' rx='4' ry='5' fill='%23FFC1E9'/%3E%3Cpath d='M25 75 Q20 85 25 90' stroke='%23FFC1E9' stroke-width='3' fill='none'/%3E%3Cpath d='M75 75 Q80 85 75 90' stroke='%23FFC1E9' stroke-width='3' fill='none'/%3E%3Ccircle cx='25' cy='92' r='4' fill='%23FFC1E9'/%3E%3Ccircle cx='75' cy='92' r='4' fill='%23FFC1E9'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.illustration-camera {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='50' r='35' fill='%23FFC1E9'/%3E%3Ccircle cx='50' cy='50' r='25' fill='%23FFF9F9'/%3E%3Ccircle cx='50' cy='50' r='18' fill='%23E5E5E5'/%3E%3Ccircle cx='50' cy='50' r='8' fill='%23333'/%3E%3Ccircle cx='50' cy='50' r='3' fill='%23FFF9F9'/%3E%3Crect x='70' y='45' width='12' height='10' rx='2' fill='%23FFC1E9'/%3E%3Ccircle cx='76' cy='50' r='2' fill='%23FFF9F9'/%3E%3Ccircle cx='65' cy='35' r='4' fill='%23FFC1E9'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.illustration-bell {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath d='M35 25 L35 50 Q35 65 50 75 Q65 65 65 50 L65 25 Z' fill='%23FFC1E9'/%3E%3Crect x='30' y='25' width='40' height='15' rx='3' fill='%23FFC1E9'/%3E%3Ccircle cx='50' cy='80' r='8' fill='%23FFC1E9'/%3E%3Cpath d='M45 88 Q50 95 55 88' stroke='%23FFC1E9' stroke-width='3' fill='none'/%3E%3Ccircle cx='50' cy='45' r='5' fill='%23FFF9F9'/%3E%3Ccircle cx='50' cy='45' r='2' fill='%23333'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.illustration-star {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath d='M50 5 L60 35 L95 40 L68 60 L78 95 L50 75 L22 95 L32 60 L5 40 L40 35 Z' fill='%23FFC1E9'/%3E%3Ccircle cx='50' cy='50' r='20' fill='%23FFF4D2'/%3E%3Cpath d='M50 38 L53 48 L63 48 L55 55 L58 65 L50 60 L42 65 L45 55 L37 48 L47 48 Z' fill='%23FFC1E9'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
  
  &.illustration-network {
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='50' r='30' fill='%23FFC1E9'/%3E%3Ccircle cx='50' cy='50' r='20' fill='%23FFF9F9'/%3E%3Ccircle cx='50' cy='50' r='8' fill='%23FFC1E9'/%3E%3Ccircle cx='25' cy='30' r='5' fill='%23FFC1E9'/%3E%3Ccircle cx='75' cy='30' r='5' fill='%23FFC1E9'/%3E%3Ccircle cx='25' cy='70' r='5' fill='%23FFC1E9'/%3E%3Ccircle cx='75' cy='70' r='5' fill='%23FFC1E9'/%3E%3Cpath d='M50 20 L50 35' stroke='%23FFC1E9' stroke-width='2'/%3E%3Cpath d='M50 65 L50 80' stroke='%23FFC1E9' stroke-width='2'/%3E%3Cpath d='M35 50 L20 50' stroke='%23FFC1E9' stroke-width='2'/%3E%3Cpath d='M65 50 L80 50' stroke='%23FFC1E9' stroke-width='2'/%3E%3Cpath d='M35 35 L25 30' stroke='%23FFC1E9' stroke-width='2'/%3E%3Cpath d='M65 35 L75 30' stroke='%23FFC1E9' stroke-width='2'/%3E%3Cpath d='M35 65 L25 70' stroke='%23FFC1E9' stroke-width='2'/%3E%3Cpath d='M65 65 L75 70' stroke='%23FFC1E9' stroke-width='2'/%3E%3C/svg%3E") no-repeat center;
    background-size: 100%;
  }
}

.empty-text {
  font-size: 28rpx;
  color: #FFC1E9;
  margin-bottom: 32rpx;
}

.empty-btn {
  padding: 20rpx 60rpx;
  background: #FFC1E9;
  color: #FFFFFF;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  
  &:active {
    transform: scale(0.98);
  }
}
</style>