---
skill: ui-design
description: 生成现代化 UI 设计方案（Tailwind/UnoCSS + 设计系统）
tags: [ui, design, tailwind, unocss, design-system]
---

# UI 设计助手

生成符合现代设计趋势的 UI 组件和设计系统配置。

## 使用方式

```
/ui-design ComponentType [style]
```

## 功能

1. 现代化设计风格（毛玻璃、渐变、阴影）
2. 响应式布局
3. 深色模式支持
4. 动画效果
5. 无障碍设计
6. 设计令牌（Design Tokens）
7. 组件变体

## 设计系统配置

**tailwind.config.js / uno.config.ts**
```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    }
  }
}
```

## 示例：卡片组件

```vue
<template>
  <div class="card-container">
    <!-- 基础卡片 -->
    <div class="card card-basic">
      <div class="card-header">
        <h3 class="card-title">基础卡片</h3>
      </div>
      <div class="card-body">
        <p>这是一个简洁的卡片设计</p>
      </div>
    </div>

    <!-- 毛玻璃卡片 -->
    <div class="card card-glass">
      <div class="card-header">
        <h3 class="card-title">毛玻璃效果</h3>
      </div>
      <div class="card-body">
        <p>现代化的毛玻璃背景</p>
      </div>
    </div>

    <!-- 渐变卡片 -->
    <div class="card card-gradient">
      <div class="card-header">
        <h3 class="card-title text-white">渐变卡片</h3>
      </div>
      <div class="card-body">
        <p class="text-white/90">炫彩渐变背景</p>
      </div>
    </div>

    <!-- 悬浮卡片 -->
    <div class="card card-hover">
      <div class="card-header">
        <h3 class="card-title">悬浮效果</h3>
      </div>
      <div class="card-body">
        <p>鼠标悬停查看效果</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  padding: 24px;
}

.card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

/* 基础卡片 */
.card-basic {
  background: white;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 毛玻璃卡片 */
.card-glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* 渐变卡片 */
.card-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
}

/* 悬浮效果 */
.card-hover {
  background: white;
  border: 1px solid #e5e7eb;
  cursor: pointer;
}

.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 24px;
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .card-basic {
    background: #1f2937;
    border-color: #374151;
    color: white;
  }
  
  .card-hover {
    background: #1f2937;
    border-color: #374151;
    color: white;
  }
}
</style>
```

## 常用设计模式

### 1. 按钮系统
```vue
<button class="btn btn-primary">主要按钮</button>
<button class="btn btn-secondary">次要按钮</button>
<button class="btn btn-outline">线框按钮</button>
<button class="btn btn-ghost">幽灵按钮</button>
```

### 2. 表单输入
```vue
<input class="input input-bordered" placeholder="输入内容" />
<input class="input input-primary" placeholder="主题色输入框" />
<input class="input input-error" placeholder="错误状态" />
```

### 3. 加载状态
```vue
<div class="loading loading-spinner"></div>
<div class="loading loading-dots"></div>
<div class="skeleton h-32 w-full"></div>
```
