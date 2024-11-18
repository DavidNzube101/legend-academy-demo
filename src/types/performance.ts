export interface PerformanceMetric {
  label: string
  percentage: number
  trend: 'up' | 'down' | 'neutral'
}

export interface ModulePerformance {
  name: string
  module1Score: number
  module2Score: number
}

export interface TestResult {
  id: string
  test: string
  mark: string
  questionsAttempted: number
  correct: number
  wrong: number
  result: 'pass' | 'failed'
}

export interface PerformanceStats {
  totalTests: number
  totalPoints: number
  testAwards: number
}