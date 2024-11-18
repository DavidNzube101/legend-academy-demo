<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-2">Assignments</h1>
      <p class="text-gray-600">View and manage your assignments</p>
    </div>

    <!-- Assignment Tabs -->
    <div class="flex gap-4 mb-6 border-b">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2 -mb-px text-sm font-medium transition-colors relative"
        :class="[
          activeTab === tab.id 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        {{ tab.name }}
        <span 
          class="ml-2 px-2 py-0.5 text-xs rounded-full"
          :class="[
            activeTab === tab.id 
              ? 'bg-blue-100 text-blue-600' 
              : 'bg-gray-100 text-gray-600'
          ]"
        >
          {{ getAssignmentsByStatus(tab.id).length }}
        </span>
      </button>
    </div>

    <!-- Assignment Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="assignment in getAssignmentsByStatus(activeTab)"
        :key="assignment.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
      >
        <div class="relative">
          <img 
            :src="assignment.thumbnail" 
            :alt="assignment.title"
            class="w-full h-48 object-cover"
          />
          <span 
            class="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded"
            :class="getStatusBadgeClass(assignment.status)"
          >
            {{ formatStatus(assignment.status) }}
          </span>
        </div>
        
        <div class="p-4">
          <h3 class="font-semibold mb-2">{{ assignment.title }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ assignment.courseName }}</p>
          
          <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div class="flex items-center">
              <ClockIcon class="w-4 h-4 mr-1" />
              {{ assignment.duration }}
            </div>
            <div>
              Due: {{ formatDate(assignment.dueDate) }}
            </div>
          </div>
          
          <button 
            @click="completeAssignment(assignment.id)"
            class="w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="[
              assignment.status === 'completed'
                ? 'bg-green-100 text-green-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            ]"
          >
            {{ assignment.status === 'completed' ? 'Completed' : 'Complete →' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div 
      v-if="getAssignmentsByStatus(activeTab).length === 0"
      class="text-center py-12"
    >
      <ClipboardListIcon class="w-16 h-16 mx-auto mb-4 text-gray-400" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Assignments</h3>
      <p class="text-gray-600">
        {{ getEmptyStateMessage(activeTab) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClockIcon, ClipboardListIcon } from 'lucide-vue-next'
import type { Assignment } from '@/types/assignments'

const tabs = [
  { id: 'pending', name: 'Pending' },
  { id: 'in_progress', name: 'In Progress' },
  { id: 'completed', name: 'Completed' }
]

const activeTab = ref('pending')

// Dummy data - replace with actual API call
const assignments = ref<Assignment[]>([
  {
    id: '1',
    courseId: '1',
    title: "Beginner's Guide to becoming a professional UI/UX Designer",
    thumbnail: "https://placehold.co/384x192",
    assignedDate: '2024-11-17',
    dueDate: '2024-11-24',
    status: 'pending',
    courseName: 'UI/UX Design Course',
    duration: '24+ Hours'
  },
  {
    id: '2',
    courseId: '2',
    title: "Front-End Web Developer Certificate Course",
    thumbnail: "https://placehold.co/384x192",
    assignedDate: '2024-11-15',
    dueDate: '2024-11-22',
    status: 'in_progress',
    courseName: 'Web Development',
    duration: '12+ Hours'
  },
  {
    id: '3',
    courseId: '3',
    title: "User Experience and User Interface Course",
    thumbnail: "https://placehold.co/384x192",
    assignedDate: '2024-11-10',
    dueDate: '2024-11-17',
    status: 'completed',
    courseName: 'UX/UI Advanced',
    duration: '8+ Hours'
  }
])

const getAssignmentsByStatus = (status: string) => {
  return assignments.value.filter(assignment => assignment.status === status)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatStatus = (status: string) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getEmptyStateMessage = (status: string) => {
  switch (status) {
    case 'pending':
      return 'You have no pending assignments'
    case 'in_progress':
      return 'You have no assignments in progress'
    case 'completed':
      return 'You have not completed any assignments yet'
    default:
      return 'No assignments found'
  }
}

const completeAssignment = (id: string) => {
  const assignment = assignments.value.find(a => a.id === id)
  if (assignment && assignment.status !== 'completed') {
    assignment.status = 'completed'
  }
}
</script>