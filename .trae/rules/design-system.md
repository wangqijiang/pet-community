# AI Design System

你现在正在开发：

「城市养狗生活社区」

这是一个：

- 宠物社交
- 宠物友好地图
- 城市生活方式

类型的小程序。

技术栈：

- uni-app
- Vue3
- setup script
- SCSS
- rpx单位

---

# 一、整体视觉风格

整体风格：

- 温暖治愈
- 日系
- 城市生活感
- 高留白
- 轻户外感
- 柔和
- 呼吸感
- 轻社交
- 轻奶油色

用户感受：

用户打开产品以后，
应该感觉：

“今天想带狗出去散步。”

而不是：

“我在使用功能型工具。”

---

# 二、禁止事项

禁止出现：

- 科技蓝
- 深色模式风格
- 电竞风
- 赛博朋克
- 高饱和颜色
- 强烈渐变
- 硬阴影
- 复杂边框
- 信息密度过高
- 工具化UI
- 安卓工具感
- 机械感
- 商务后台风

---

# 三、设计语言

必须：

- 大圆角
- 卡片化布局
- 高留白
- 柔和阴影
- 呼吸感
- 轻量视觉
- 毛玻璃
- 大图片
- 柔和交互

页面必须：

- 看起来轻松
- 看起来柔软
- 看起来有陪伴感

---

# 四、颜色规范

主色：

#FFB36B

主色浅色：

#FFE2C2

背景色：

#FFF7F1

卡片背景：

#FFFFFF

主文字：

#3D2F2F

辅助文字：

#8A7F7F

浅文字：

#B0A6A6

边框：

#F1E5DA

成功：

#9BCF9B

警告：

#FFC978

---

# 五、字体规范

字体：

Noto Sans SC

标题：

font-size: 36rpx
font-weight: 700

副标题：

font-size: 30rpx
font-weight: 600

正文：

font-size: 28rpx
font-weight: 400

辅助文字：

font-size: 24rpx

禁止：

- 字号过小
- 字号过密
- 英文科技字体

---

# 六、rpx 规范

所有尺寸必须使用：

rpx

禁止：

- px
- rem
- em

推荐 spacing：

8rpx
12rpx
16rpx
24rpx
32rpx
40rpx

页面左右 padding：

32rpx

卡片间距：

24rpx

---

# 七、圆角规范

小圆角：

12rpx

普通卡片：

24rpx

大卡片：

32rpx

按钮：

999rpx

图片：

24rpx

---

# 八、阴影规范

统一使用：

box-shadow:
0 8rpx 32rpx rgba(107,78,61,0.06)

禁止：

- 重阴影
- 黑色阴影
- 强拟物

---

# 九、Icon规范

统一使用：

lucide-vue-next

禁止：

- 阿里iconfont
- antd icon
- material icon
- 多icon库混用

icon要求：

- 线性
- 圆润
- stroke风格
- 轻量
- 日系

---

# 十、uni-app规范

页面：

使用：

<template>
<script setup>
<style lang=\"scss\" scoped>

禁止 Options API。

---

# 十一、组件规范

所有组件：

必须组件化。

禁止：

一个页面写所有代码。

推荐组件：

- TopNavBar
- TabBar
- PostCard
- FeedList
- UserAvatar
- LocationCard
- FloatingButton

---

# 十二、页面布局规范

页面必须：

- 高留白
- 卡片流
- 大图片
- 轻量内容

禁止：

- 信息密度高
- 表格感
- 后台感

---

# 十三、交互规范

transition：

200ms ease

点击：

轻微缩放

hover：

scale(1.02)

禁止：

- 复杂动画
- 强弹窗
- 重交互

---

# 十四、TabBar规范

TabBar：

- 毛玻璃
- 白色半透明
- 顶部浅边框
- 圆角顶部

高度：

120rpx

icon：

44rpx

文字：

22rpx

激活态：

#FFB36B

---

# 十五、TopNavBar规范

TopNavBar：

- 毛玻璃
- 浅背景
- 高度舒适
- 不压迫

高度：

176rpx

左右padding：

32rpx

---

# 十六、PostCard规范

PostCard：

- 白色背景
- 24rpx圆角
- 大图片
- 柔和阴影

图片：

16rpx圆角

内边距：

32rpx

---

# 十七、地图页规范

地图：

必须浅色地图。

Marker：

必须定制。

推荐：

- 爪印
- 草地
- 咖啡
- 公园

禁止默认地图Marker。

---

# 十八、产品气质

整个产品：

不是：

“宠物工具”

而是：

“年轻人带狗生活社区”

必须有：

- 情绪感
- 陪伴感
- 生活方式感
- 周末感
- 阳光感
