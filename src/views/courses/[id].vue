<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Course Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold mb-2">{{ course.title }}</h1>
        <div class="flex items-center">
          <img 
            :src="course.instructor.avatar" 
            :alt="course.instructor.name"
            class="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <div class="font-medium">{{ course.instructor.name }}</div>
            <div class="text-sm text-gray-600">{{ course.instructor.title }}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2">
          <!-- Video Player -->
          <div v-if="activeModule?.type === 'video'" class="bg-black rounded-lg overflow-hidden mb-6">
            <video
              class="w-full aspect-video"
              controls
              :src="(activeModule.content as VideoContent).videoUrl"
            />
          </div>

          <!-- Quiz -->
          <div v-else-if="activeModule?.type === 'quiz'" class="bg-white rounded-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">{{ activeModule.title }}</h2>
              <div class="text-sm text-gray-600">
                Time Remaining: {{ formatTime(timeRemaining) }}
              </div>
            </div>

            <div v-if="currentQuestion" class="space-y-6">
              <div class="text-lg font-medium">
                Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
              </div>
              
              <div class="text-gray-800">{{ currentQuestion.text }}</div>

              <div class="space-y-3">
                <label 
                  v-for="option in currentQuestion.options" 
                  :key="option.id"
                  class="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input 
                    type="radio" 
                    :name="'question-' + currentQuestion.id"
                    :value="option.id"
                    v-model="selectedAnswer"
                    class="mr-3"
                  />
                  <span>{{ option.text }}</span>
                </label>
              </div>

              <div class="flex justify-between pt-6">
                <button 
                  @click="previousQuestion"
                  class="px-4 py-2 text-gray-600 hover:text-gray-800"
                  :disabled="currentQuestionIndex === 0"
                >
                  Previous
                </button>
                <button 
                  @click="nextQuestion"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {{ isLastQuestion ? 'Submit' : 'Next' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Module Description -->
          <div class="bg-white rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">About This Module</h2>
            <p class="text-gray-600">
              {{ activeModule?.type === 'video' 
                ? (activeModule.content as VideoContent).description 
                : 'Complete the quiz to test your knowledge.' }}
            </p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg p-6">
            <h3 class="font-semibold mb-4">Course Modules</h3>
            <div class="space-y-2">
              <button
                v-for="module in course.modules"
                :key="module.id"
                @click="setActiveModule(module)"
                class="w-full flex items-center p-3 rounded-lg hover:bg-gray-50"
                :class="module.id === activeModule?.id ? 'bg-blue-50' : ''"
              >
                <component 
                  :is="module.type === 'video' ? PlayCircleIcon : ClipboardListIcon"
                  class="w-5 h-5 mr-3"
                  :class="module.completed ? 'text-green-500' : 'text-gray-400'"
                />
                <div class="flex-1 text-left">
                  <div class="font-medium">{{ module.title }}</div>
                  <div class="text-sm text-gray-600">{{ module.duration }}</div>
                </div>
                <CheckCircle2Icon 
                  v-if="module.completed"
                  class="w-5 h-5 text-green-500 ml-2"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlayCircleIcon, ClipboardListIcon, CheckCircle2Icon } from 'lucide-vue-next'
import type { Course, CourseModule, VideoContent, QuizContent, Question } from '@/types/course.ts'

// Dummy data - replace with API call using route params
const course = ref<Course>({
  id: '1',
  title: "Beginner's Guide to becoming a professional UI/UX Designer",
  thumbnail: "https://placehold.co/384x192",
  instructor: {
    id: '1',
    name: 'Joseph Brandon',
    title: 'Senior UI/UX Designer',
    avatar: "https://placehold.co/24"
  },
  duration: '24+ Hours',
  tag: 'UI/UX',
  description: 'Learn the fundamentals of UI/UX design...',
  progress: 45,
  modules: [
    {
      id: '1',
      title: 'Introduction to UI/UX',
      duration: '15 mins',
      type: 'video',
      completed: true,
      content: {
        videoUrl: 'https://example.com/video.mp4',
        description: 'An introduction to the fundamentals of UI/UX design...'
      }
    },
    {
      id: '2',
      title: 'Module 1 Quiz',
      duration: '10 mins',
      type: 'quiz',
      completed: false,
      content: {
        questions: [
          {
            id: '1',
            text: 'What is the role of a User Interface and User Experience Designer (UI/UX)?',
            points: 3,
            options: [
              { id: 'a', text: 'To design the visual only', isCorrect: false },
              { id: 'b', text: 'To design the experience only', isCorrect: false },
              { id: 'c', text: 'To design both the interface and the experience', isCorrect: true },
              { id: 'd', text: 'None of the above', isCorrect: false }
            ]
          }
          // Add more questions...
        ],
        timeLimit: 600,
        totalPoints: 10
      }
    }
  ]
})

const activeModule = ref<CourseModule>(course.value.modules[0])
const timeRemaining = ref(600) // 10 minutes in seconds
const currentQuestionIndex = ref(0)
const selectedAnswer = ref('')

const setActiveModule = (module: CourseModule) => {
  activeModule.value = module
  if (module.type === 'quiz') {
    currentQuestionIndex.value = 0
    selectedAnswer.value = ''
    timeRemaining.value = (module.content as QuizContent).timeLimit
  }
}

const currentQuestion = computed(() => {
  if (activeModule.value?.type === 'quiz') {
    const questions = (activeModule.value.content as QuizContent).questions
    return questions[currentQuestionIndex.value]
  }
  return null
})

const totalQuestions = computed(() => {
  if (activeModule.value?.type === 'quiz') {
    return (activeModule.value.content as QuizContent).questions.length
  }
  return 0
})

const isLastQuestion = computed(() => {
  return currentQuestionIndex.value === totalQuestions.value - 1
})

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const nextQuestion = () => {
  if (isLastQuestion.value) {
    // Handle quiz submission
    console.log('Quiz completed!')
  } else {
    currentQuestionIndex.value++
    selectedAnswer.value = ''
  }
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = ''
  }
}
</script>