import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/courses',
    name: 'Courses',
    component: () => import('@/views/courses/index.vue')
  },
  {
    path: '/courses/:id',
    name: 'CourseDetail',
    component: () => import('@/views/courses/[id].vue')
  },
  {
    path: '/assignments',
    name: 'Assignments',
    component: () => import('@/views/Assignments.vue')
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('@/views/Calendar.vue')
  },
  {
    path: '/discussions',
    name: 'Discussions',
    component: () => import('@/views/Calendar.vue')
  },
  {
    path: '/resources',
    name: 'Resources',
    component: () => import('@/views/Calendar.vue')
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('@/views/Calendar.vue')
  },
  {
    path: '/support',
    name: 'Support',
    component: () => import('@/views/Calendar.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Calendar.vue')
  },
  {
    path: '/notification',
    name: 'Notification',
    component: () => import('@/views/Calendar.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router