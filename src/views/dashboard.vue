<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Welcome Section -->
    <div class="mb-8">
      <div class="bg-orange-500 text-white rounded-xl p-6 relative overflow-hidden">
        <div class="relative z-10">
          <h1 class="text-2xl font-bold mb-2">Welcome Back Favour!</h1>
          <p class="mb-4">
            Congratulations! you have learned 80% of your course this month. Keep it up, you're almost there.
          </p>
          <button class="bg-white text-orange-500 px-4 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors">
            Continue Learning
          </button>
        </div>
        <!-- Decorative Elements -->
        <div class="absolute right-0 bottom-0 opacity-10">
          <div class="w-32 h-32 bg-white rounded-full -mb-16 -mr-16"></div>
        </div>
      </div>
    </div>

    <!-- Course Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div v-for="course in recentCourses" :key="course.id" 
           class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <img :src="course.thumbnail" :alt="course.title" class="w-full h-40 object-cover" />
        <div class="p-4">
          <span class="text-xs font-medium text-blue-600 mb-2 block">{{ course.tag }}</span>
          <h3 class="font-semibold mb-2">{{ course.title }}</h3>
          <div class="flex items-center mb-3">
            <img :src="course.instructorImage" :alt="course.instructor" class="w-6 h-6 rounded-full mr-2" />
            <span class="text-sm text-gray-600">{{ course.instructor }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-500">{{ course.duration }}</span>
            <button class="text-blue-600 hover:text-blue-700">Continue →</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Dropdown -->
    <div class="fixed top-4 right-4 z-50">
      <div class="relative">
        <button 
          @click="toggleNotifications"
          class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-gray-100': showNotifications }"
        >
          <BellIcon class="w-6 h-6" />
          <span v-if="unreadNotifications > 0" 
                class="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {{ unreadNotifications }}
          </span>
        </button>

        <!-- Dropdown -->
        <div v-if="showNotifications" 
             class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div class="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="font-semibold">Notifications</h3>
            <button @click="markAllAsRead" 
                    class="text-sm text-blue-600 hover:text-blue-700">
              Mark all as read
            </button>
          </div>
          
          <div class="max-h-96 overflow-y-auto">
            <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
              <BellOffIcon class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No Recent Notifications</p>
              <p class="text-sm">You'll be notified when there's something new</p>
            </div>
            
            <div v-else v-for="notification in notifications" 
                 :key="notification.id"
                 class="p-4 border-b border-gray-100 hover:bg-gray-50"
                 :class="{ 'bg-blue-50': !notification.read }">
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <component :is="getNotificationIcon(notification.type)" 
                           class="w-5 h-5" 
                           :class="getNotificationIconColor(notification.type)" />
                </div>
                <div>
                  <p class="text-sm">{{ notification.message }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatTime(notification.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Bell as BellIcon, 
  BellOff as BellOffIcon,
  Trophy as TrophyIcon,
  BookOpen as BookOpenIcon,
  Calendar as CalendarIcon
} from 'lucide-vue-next'

export default {
  name: 'Dashboard',
  components: {
    BellIcon,
    BellOffIcon,
    TrophyIcon,
    BookOpenIcon,
    CalendarIcon
  },
  setup() {
    const showNotifications = ref(false)
    const unreadNotifications = ref(2)

    const recentCourses = ref([
      {
        id: '1',
        title: "Beginner's Guide to becoming a professional UI/UX Designer",
        instructor: "Joseph Brandon",
        duration: "24+ Hours",
        tag: "UI/UX",
        thumbnail: "https://placehold.co/320x160",
        instructorImage: "https://placehold.co/24"
      },
      {
        id: '2',
        title: "Advance your career, become a Senior UI/UX Designer",
        instructor: "Joseph Brandon",
        duration: "24+ Hours",
        tag: "UI/UX",
        thumbnail: "https://placehold.co/320x160",
        instructorImage: "https://placehold.co/24"
      },
      {
        id: '3',
        title: "Front-End Web Developer Certificate Course",
        instructor: "Joseph Brandon",
        duration: "24+ Hours",
        tag: "CODING",
        thumbnail: "https://placehold.co/320x160",
        instructorImage: "https://placehold.co/24"
      }
    ])

    const notifications = ref([
      {
        id: '1',
        type: 'achievement',
        message: 'Congratulations! You have earned 100 Points',
        timestamp: new Date(Date.now() - 20 * 60000),
        read: false
      },
      {
        id: '2',
        type: 'assignment',
        message: 'You have been assigned a new assignment',
        timestamp: new Date(Date.now() - 45 * 60000),
        read: false
      },
      {
        id: '3',
        type: 'course',
        message: 'New course "Advanced UI Patterns" is available',
        timestamp: new Date(Date.now() - 120 * 60000),
        read: true
      }
    ])

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
    }

    const markAllAsRead = () => {
      notifications.value = notifications.value.map(notification => ({
        ...notification,
        read: true
      }))
      unreadNotifications.value = 0
    }

    const getNotificationIcon = (type) => {
      switch (type) {
        case 'achievement':
          return TrophyIcon
        case 'course':
          return BookOpenIcon
        case 'assignment':
          return CalendarIcon
        default:
          return BellIcon
      }
    }

    const getNotificationIconColor = (type) => {
      switch (type) {
        case 'achievement':
          return 'text-yellow-500'
        case 'course':
          return 'text-blue-500'
        case 'assignment':
          return 'text-green-500'
        default:
          return 'text-gray-500'
      }
    }

    const formatTime = (date) => {
      const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
      if (minutes < 60) return `${minutes}m ago`
      if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
      return date.toLocaleDateString()
    }

    // Close notifications when clicking outside
    const handleClickOutside = (event) => {
      const target = event.target
      if (!target.closest('.notification-dropdown')) {
        showNotifications.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      showNotifications,
      unreadNotifications,
      recentCourses,
      notifications,
      toggleNotifications,
      markAllAsRead,
      getNotificationIcon,
      getNotificationIconColor,
      formatTime
    }
  }
}
</script>