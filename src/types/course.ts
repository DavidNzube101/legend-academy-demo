export interface Instructor {
  id: string
  name: string
  title: string
  avatar: string
}

export interface Course {
  id: string
  title: string
  thumbnail: string
  instructor: Instructor
  duration: string
  tag: string
  description: string
  progress: number
  modules: CourseModule[]
}

export interface CourseModule {
  id: string
  title: string
  duration: string
  type: 'video' | 'quiz'
  completed: boolean
  content: VideoContent | QuizContent
}

export interface VideoContent {
  videoUrl: string
  description: string
}

export interface QuizContent {
  questions: Question[]
  timeLimit: number
  totalPoints: number
}

export interface Question {
  id: string
  text: string
  points: number
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
}