export interface Assignment {
  id: string
  courseId: string
  title: string
  thumbnail: string
  assignedDate: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed'
  courseName: string
  duration: string
}