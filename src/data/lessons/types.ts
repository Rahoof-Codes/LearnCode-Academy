export interface QuizQuestion {
  question: string;
  options: string[];
  correctOption?: number; // Only needed for HandcraftedLesson
  explanation: string;
}

export interface CodingTask {
  description: string;
  starterCode: string;
  language: string;
  expectedOutput: string;
  expectedOutputDisplay: string;
  validate: (code: string) => { isPassed: boolean; logs: string[] };
}

export interface HandcraftedLesson {
  title: string;
  content: string[];
  quiz: QuizQuestion[];
  task: CodingTask;
}

export interface TamilLesson {
  title: string;
  content: string[];
  quiz: {
    question: string;
    options: string[];
    explanation: string;
  }[];
  taskDescription: string;
}
