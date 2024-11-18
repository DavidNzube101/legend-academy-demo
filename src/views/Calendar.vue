<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Calendar</h1>
        <p class="text-gray-600">Stay updated on your upcoming events</p>
      </div>
      <div class="flex gap-4">
        <div class="flex rounded-lg border bg-white">
          <button 
            v-for="view in views" 
            :key="view"
            @click="currentView = view"
            class="px-4 py-2 text-sm"
            :class="currentView === view ? 'bg-orange-500 text-white' : 'text-gray-600'"
          >
            {{ view }}
          </button>
        </div>
        <button class="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2">
          <PlusIcon class="w-4 h-4" />
          Add Event
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm">
      <!-- Calendar Header -->
      <div class="p-4 border-b flex justify-between items-center">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold">{{ currentMonthYear }}</h2>
          <div class="flex gap-1">
            <button @click="previousMonth" class="p-1 hover:bg-gray-100 rounded">
              <ChevronLeftIcon class="w-5 h-5" />
            </button>
            <button @click="nextMonth" class="p-1 hover:bg-gray-100 rounded">
              <ChevronRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        <button class="text-sm text-blue-600" @click="goToToday">Today</button>
      </div>

      <!-- Calendar Grid -->
      <div class="p-4">
        <!-- Days of Week -->
        <div class="grid grid-cols-7 mb-2">
          <div v-for="day in daysOfWeek" 
               :key="day" 
               class="text-sm font-medium text-gray-500 text-center py-2">
            {{ day }}
          </div>
        </div>

        <!-- Calendar Days -->
        <div class="grid grid-cols-7 gap-px bg-gray-200">
          <div v-for="(day, index) in calendarDays" 
               :key="index"
               class="min-h-[120px] bg-white p-2"
               :class="{
                 'bg-gray-50': !day.isCurrentMonth,
                 'bg-blue-50': day.isToday
               }">
            <div class="text-sm" :class="{ 'text-gray-400': !day.isCurrentMonth }">
              {{ day.date }}
            </div>
            
            <!-- Events -->
            <div class="mt-1 space-y-1">
              <div v-for="event in day.events" 
                   :key="event.id"
                   class="text-xs p-1 rounded truncate"
                   :class="getEventClass(event.type)">
                {{ event.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Plus as PlusIcon
} from 'lucide-vue-next'

export default {
  name: 'Calendar',
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon
  },
  setup() {
    const views = ['Monthly', 'Weekly', 'Daily']
    const currentView = ref('Monthly')
    const currentDate = ref(new Date())
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    // Sample events data
    const events = [
      {
        id: 1,
        title: 'Design Review',
        type: 'meeting',
        date: new Date(2024, 0, 15)
      },
      {
        id: 2,
        title: 'UI/UX Workshop',
        type: 'workshop',
        date: new Date(2024, 0, 8)
      },
      {
        id: 3,
        title: 'Project Deadline',
        type: 'deadline',
        date: new Date(2024, 0, 22)
      }
    ]

    const currentMonthYear = computed(() => {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        year: 'numeric' 
      }).format(currentDate.value)
    })

    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()
      
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      
      const daysInMonth = lastDay.getDate()
      const startingDay = firstDay.getDay()
      
      const days = []
      
      // Previous month's days
      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = startingDay - 1; i >= 0; i--) {
        days.push({
          date: prevMonthLastDay - i,
          isCurrentMonth: false,
          isToday: false,
          events: []
        })
      }
      
      // Current month's days
      const today = new Date()
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i)
        days.push({
          date: i,
          isCurrentMonth: true,
          isToday: date.toDateString() === today.toDateString(),
          events: events.filter(event => 
            event.date.toDateString() === date.toDateString()
          )
        })
      }
      
      // Next month's days
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        days.push({
          date: i,
          isCurrentMonth: false,
          isToday: false,
          events: []
        })
      }
      
      return days
    })

    const previousMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
      )
    }

    const nextMonth = () => {
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
      )
    }

    const goToToday = () => {
      currentDate.value = new Date()
    }

    const getEventClass = (type) => {
      switch (type) {
        case 'meeting':
          return 'bg-blue-100 text-blue-800'
        case 'workshop':
          return 'bg-green-100 text-green-800'
        case 'deadline':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    return {
      views,
      currentView,
      daysOfWeek,
      currentMonthYear,
      calendarDays,
      previousMonth,
      nextMonth,
      goToToday,
      getEventClass
    }
  }
}
</script>