import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      redirect: '/dashboard',
      children: [
        { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '仪表盘' } },
        { path: 'users', name: 'Users', component: () => import('@/views/users/UserList.vue'), meta: { title: '用户管理' } },
        { path: 'posts', name: 'Posts', component: () => import('@/views/posts/PostList.vue'), meta: { title: '动态管理' } },
        { path: 'comments', name: 'Comments', component: () => import('@/views/comments/CommentList.vue'), meta: { title: '评论管理' } },
        { path: 'pets', name: 'Pets', component: () => import('@/views/pets/PetList.vue'), meta: { title: '宠物管理' } },
        { path: 'places', name: 'Places', component: () => import('@/views/places/PlaceList.vue'), meta: { title: '场所管理' } },
        { path: 'places/new', name: 'PlaceNew', component: () => import('@/views/places/PlaceEdit.vue'), meta: { title: '新增场所' } },
        { path: 'places/:id', name: 'PlaceEdit', component: () => import('@/views/places/PlaceEdit.vue'), meta: { title: '编辑场所' } },
        { path: 'place-reviews', name: 'PlaceReviews', component: () => import('@/views/reviews/PlaceReviewList.vue'), meta: { title: '场所评价' } },
        { path: 'post-categories', name: 'PostCategories', component: () => import('@/views/categories/CategoryList.vue'), meta: { title: '动态分类', type: 'post' } },
        { path: 'place-categories', name: 'PlaceCategories', component: () => import('@/views/categories/CategoryList.vue'), meta: { title: '场所分类', type: 'place' } },
        { path: 'guides', name: 'Guides', component: () => import('@/views/guides/GuideList.vue'), meta: { title: '攻略管理' } },
        { path: 'guides/new', name: 'GuideNew', component: () => import('@/views/guides/GuideEdit.vue'), meta: { title: '新增攻略' } },
        { path: 'guides/:id', name: 'GuideEdit', component: () => import('@/views/guides/GuideEdit.vue'), meta: { title: '编辑攻略' } },
        { path: 'notifications', name: 'Notifications', component: () => import('@/views/notifications/Broadcast.vue'), meta: { title: '系统通知' } },
        { path: 'ai-chats', name: 'AiChats', component: () => import('@/views/ai/AiChatList.vue'), meta: { title: 'AI 对话' } },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    return { name: 'Login' }
  }
  if (to.name === 'Login' && auth.isLoggedIn) {
    return { name: 'Dashboard' }
  }
})

export default router
