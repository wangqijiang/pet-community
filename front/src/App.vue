<template>
  <view></view>
</template>

<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  }
}
</script>

<style lang="scss">
@import './styles/design-system.scss';

/* Global Styles */
page {
  background-color: var(--surface);
  font-family: var(--font-body);
  font-size: var(--text-body-md);
  line-height: var(--text-body-md-line);
  color: var(--on-surface);
}

/* Reset */
view, text, image {
  box-sizing: border-box;
}

/* Utility Classes */
.flex {
  display: flex;
}

.flex-col {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

/* Spacing Utilities */
.p-container {
  padding: var(--padding-container);
}

.m-page {
  margin: var(--margin-page);
}

.gap-stack {
  gap: var(--stack-gap);
}

.gap-card {
  gap: var(--gutter-card);
}
</style>
