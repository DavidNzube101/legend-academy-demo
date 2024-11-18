<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-2">Courses</h1>
      <p class="text-gray-600">View and manage your courses</p>
    </div>

    <!-- Course Tabs -->
    <div class="flex gap-4 mb-6">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 rounded-lg text-sm transition-colors',
          activeTab === tab.id 
            ? 'bg-blue-50 text-blue-600' 
            : 'text-gray-600 hover:bg-gray-100'
        ]"
      >
        {{ tab.name }} ({{ tab.count }})
      </button>
    </div>

    <!-- Course Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="course in filteredCourses"
        :key="course.id"
        :to="{ name: 'CourseDetail', params: { id: course.id }}"
        class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="relative">
          <img 
            :src="course.thumbnail" 
            :alt="course.title"
            class="w-full h-48 object-cover"
          />
          <span 
            class="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded"
          >
            {{ course.tag }}
          </span>
        </div>
        
        <div class="p-4">
          <h3 class="font-semibold mb-2 line-clamp-2">{{ course.title }}</h3>
          
          <div class="flex items-center mb-3">
            <img 
              :src="course.instructor.avatar" 
              :alt="course.instructor.name"
              class="w-6 h-6 rounded-full mr-2"
            />
            <span class="text-sm text-gray-600">{{ course.instructor.name }}</span>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center text-sm text-gray-500">
              <ClockIcon class="w-4 h-4 mr-1" />
              {{ course.duration }}
            </div>
            <div class="flex items-center">
              <div class="w-24 h-1 rounded-full bg-gray-200 mr-2">
                <div 
                  class="h-full rounded-full bg-blue-600"
                  :style="{ width: `${course.progress}%` }"
                />
              </div>
              <span class="text-sm text-gray-600">{{ course.progress }}%</span>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClockIcon } from 'lucide-vue-next'
import type { Course } from '@/types/course'

const tabs = [
  { id: 'all', name: 'All Courses', count: 11 },
  { id: 'ongoing', name: 'Ongoing', count: 6 },
  { id: 'not-started', name: 'Not Started', count: 2 },
  { id: 'completed', name: 'Completed', count: 3 },
]

const activeTab = ref('all')

// Dummy data - replace with actual API call
const courses = ref<Course[]>([
  {
    id: '1',
    title: "Beginner's Guide to becoming a professional UI/UX Designer",
    thumbnail: "https://placehold.co/284x192",
    instructor: {
      id: '1',
      name: 'Joseph Brandon',
      title: 'Senior UI/UX Designer',
      avatar: "https://placehold.co/24"
    },
    duration: '24+ Hours',
    tag: 'UI/UX',
    description: '',
    progress: 45,
    modules: []
  },
  // Add more courses...
])

const filteredCourses = computed(() => {
  switch (activeTab.value) {
    case 'ongoing':
      return courses.value.filter(course => course.progress > 0 && course.progress < 100)
    case 'not-started':
      return courses.value.filter(course => course.progress === 0)
    case 'completed':
      return courses.value.filter(course => course.progress === 100)
    default:
      return courses.value
  }
})
</script>