<script setup>
import { computed } from 'vue'

const props = defineProps({
  padding: {
    type: String,
    default: 'medium' // none, small, medium, large
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const cardClass = computed(() => [
  `card-padding-${props.padding}`,
  {
    'card-clickable': props.clickable
  }
])

const handleClick = () => {
  if (props.clickable) {
    uni.vibrateShort({ type: 'light' })
    emit('click')
  }
}
</script>

<template>
  <view class="custom-card marshmallow-shadow" :class="cardClass" @tap="handleClick">
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped>
.custom-card {
  background: linear-gradient(135deg, #ffffff 0%, #f9f2f2 100%);
  border-radius: 24px;
  border: 1px solid #d2c3c4;
  overflow: hidden;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.card-padding-none {
  padding: 0;
}

.card-padding-small {
  padding: 12px;
}

.card-padding-medium {
  padding: 16px;
}

.card-padding-large {
  padding: 24px;
}

.card-clickable {
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 4px 12px rgba(168, 155, 157, 0.08);
  }
}
</style>
