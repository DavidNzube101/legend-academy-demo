<template>
  <div id="app">
    <!-- Left Sidebar -->
    <aside class="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
      <div class="flex items-center mb-8">
        <h1 class="text-xl font-bold">Academy</h1>
      </div>
      
      <nav class="space-y-2">
        <router-link 
          v-for="item in navigationItems" 
          :key="item.name"
          :to="{ name: item.name }"
          class="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
          :class="{ 'bg-red-50 text-red-600': $route.name === item.name }"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="ml-64 p-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { 
  LayoutDashboard, 
  GraduationCap, 
  ClipboardList, 
  Calendar,
  MessageSquare,
  FileText,
  Trophy,
  HelpCircle,
  Settings,
  Bell
} from 'lucide-vue-next'

export default {
  name: 'App',
  data() {
    return {
      navigationItems: [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Courses', icon: GraduationCap },
        { name: 'Assignments', icon: ClipboardList },
        { name: 'Calendar', icon: Calendar },
        { name: 'Discussions', icon: MessageSquare },
        { name: 'Resources', icon: FileText },
        { name: 'Achievements', icon: Trophy },
        { name: 'Support', icon: HelpCircle },
        { name: 'Settings', icon: Settings },
        { name: 'Notification', icon: Bell },
      ]
    }
  }
}
</script>

<style>
@import './styles/tailwind.css';
@import './style.css';

#app {
  min-height: 100vh;
  background-color: rgb(249, 250, 251);
}
</style>